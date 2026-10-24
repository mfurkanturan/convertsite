import type pg from 'pg';
import type { PgBoss } from 'pg-boss';
import { randomUUID } from 'node:crypto';
import { transaction } from '../../../platform/database.js';
import { AppError } from '../../../platform/error.js';
import { encryptSecret, decryptSecret } from '../../../platform/secret.js';
import type { Config } from '../../../platform/config.js';
import type { FileRepository } from '../../files/public.js';
import type { usageRepository } from '../../usage/public.js';
import type { JobRecord } from '../domain/job.js';
import { isActive } from '../domain/job.js';
import type { JobRepository } from '../application/ports.js';
import type { HandlerRegistry } from '../application/ports.js';

type Admission = (client: pg.PoolClient) => { files: FileRepository; usage: ReturnType<typeof usageRepository> };
export const queueName = 'document-processing';
export function jobRepository(pool: pg.Pool, boss: PgBoss, config: Config, admission: Admission, handlers: HandlerRegistry): JobRepository {
  async function owned(client: pg.Pool | pg.PoolClient, owner: string, id: string, lock = false) {
    const result = await client.query<JobRecord>(`SELECT * FROM jobs WHERE id=$1 AND owner=$2 AND NOT deleted ${lock ? 'FOR UPDATE' : ''}`, [id, owner]);
    if (!result.rows[0]) throw new AppError('NOT_FOUND', 'İşlem bulunamadı.', 404);
    return result.rows[0];
  }
  return {
    async usesFile(id, activeOnly = false) {
      const result = await pool.query(`SELECT id FROM jobs WHERE ($1=ANY(input_ids) OR output_id=$1) AND NOT deleted ${activeOnly ? "AND state IN ('queued','running') AND expires_at>now()" : ''} LIMIT 1`, [id]);
      return Boolean(result.rowCount);
    },
    async expireStale() {
      const expired = await pool.query<JobRecord>(`SELECT * FROM jobs WHERE state IN ('queued','running') AND (expires_at<=now() OR created_at<now()-interval '10 minutes')`);
      for (const job of expired.rows) await transaction(pool, async (client) => {
        const { usage } = admission(client); await usage.lock(job.owner);
        const changed = await client.query(`UPDATE jobs SET state='failed',error='PROCESSING_TIMEOUT',attempt=NULL WHERE id=$1 AND state IN ('queued','running') AND (expires_at<=now() OR created_at<now()-interval '10 minutes')`, [job.id]);
        if (changed.rowCount) { await usage.release(job.owner); await client.query('DELETE FROM job_secrets WHERE job_id=$1', [job.id]); }
      });
      await pool.query(`DELETE FROM job_secrets s
        WHERE s.expires_at<=now() OR EXISTS (
          SELECT 1 FROM jobs j WHERE j.id=s.job_id AND (j.deleted OR j.state IN ('succeeded','failed','cancelled'))
        )`);
    },
    async create(owner, ids, key, hash, tool = 'merge-pdf', options = {}) {
      if (ids.length > config.maxFiles) throw new AppError('LIMIT_EXCEEDED', 'Dosya adedi sınırı aşıldı.', 413);
      return transaction(pool, async (client) => {
        const { files, usage } = admission(client);
        await usage.lock(owner);
        const prior = (await client.query<JobRecord>('SELECT * FROM jobs WHERE owner=$1 AND idempotency_key=$2', [owner, key])).rows[0];
        if (prior) {
          if (prior.request_hash !== hash || prior.deleted) throw new AppError('IDEMPOTENCY_CONFLICT', 'İstek anahtarı farklı bir işlem için kullanılmış.', 409);
          return prior;
        }
        const inputs = await files.lockInputs(owner, ids);
        const handler = handlers.get(tool);
        if (!handler) throw new AppError('ENGINE_UNAVAILABLE', 'Bu aracın motoru kullanılamıyor.', 503);
        handler.validate?.(inputs);
        if (inputs.reduce((n, f) => n + f.size, 0) > config.maxTotalBytes || inputs.reduce((n, f) => n + f.pages, 0) > config.maxTotalPages) throw new AppError('LIMIT_EXCEEDED', 'Toplam dosya boyutu veya sayfa sınırı aşıldı.', 413);
        if ((await client.query('SELECT id FROM jobs WHERE input_ids && $1::uuid[] AND NOT deleted LIMIT 1', [ids])).rowCount) throw new AppError('FILE_IN_USE', 'Dosyalar başka bir işleme ait. Yeniden yükle.', 409);
        await usage.reserve(owner);
        const id = randomUUID(); const expires = new Date(Date.now() + config.retentionMinutes * 60000);
        await files.protect(ids, expires);
        const { password, ...storedOptions } = options;
        const result = await client.query<JobRecord>(`INSERT INTO jobs(id,owner,tool,state,input_ids,idempotency_key,request_hash,expires_at,options) VALUES($1,$2,$7,'queued',$3,$4,$5,$6,$8) RETURNING *`, [id, owner, ids, key, hash, expires, tool, storedOptions]);
        if (password) await client.query(`INSERT INTO job_secrets(job_id,secret,expires_at) VALUES($1,$2,$3)`, [id, encryptSecret(config.secretKey, password), expires]);
        const sent = await boss.send(queueName, { id }, { db: { executeSql: (text, values) => client.query(text, values) }, retryLimit: 2, retryDelay: 5, expireInSeconds: 180 });
        if (!sent) throw new Error('QUEUE_ADMISSION_FAILED');
        return result.rows[0];
      });
    },
    owned: (owner, id) => owned(pool, owner, id),
    async secretFor(id: string) {
      const result = await pool.query<{ secret: Buffer }>(`SELECT secret FROM job_secrets WHERE job_id=$1 AND expires_at>now()`, [id]);
      if (!result.rows[0]) return null;
      try { return decryptSecret(config.secretKey, result.rows[0].secret); }
      catch { return null; }
    },
    async claim(id, attempt) {
      const result = await pool.query<JobRecord>(`UPDATE jobs SET state='running',attempt=$2 WHERE id=$1 AND state IN ('queued','running') AND NOT deleted AND expires_at>now() RETURNING *`, [id, attempt]);
      return result.rows[0] ?? null;
    },
    async finish(job, attempt, output) {
      return transaction(pool, async (client) => {
        const { files, usage } = admission(client);
        await usage.lock(job.owner);
        const current = (await client.query<JobRecord>('SELECT * FROM jobs WHERE id=$1 FOR UPDATE', [job.id])).rows[0];
        if (current.state !== 'running' || current.deleted || current.attempt !== attempt || current.expires_at <= new Date()) return false;
        const expiresAt = new Date(Date.now() + config.retentionMinutes * 60000);
        await files.insert({ ...output, owner: job.owner, status: 'ready', expiresAt });
        await files.protect(job.input_ids, expiresAt);
        await client.query(`UPDATE jobs SET state='succeeded',output_id=$2,expires_at=$3 WHERE id=$1`, [job.id, output.id, expiresAt]);
        await client.query('DELETE FROM job_secrets WHERE job_id=$1', [job.id]);
        await usage.release(job.owner);
        return true;
      });
    },
    async fail(job, attempt, code) {
      await transaction(pool, async (client) => {
        const { usage } = admission(client); await usage.lock(job.owner);
        const changed = await client.query(`UPDATE jobs SET state='failed',error=$3 WHERE id=$1 AND attempt=$2 AND state='running'`, [job.id, attempt, code]);
        if (changed.rowCount) { await usage.release(job.owner); await client.query('DELETE FROM job_secrets WHERE job_id=$1', [job.id]); }
      });
    },
    async cancel(owner, id, remove = false) {
      await transaction(pool, async (client) => {
        const { files, usage } = admission(client); await usage.lock(owner);
        const job = await owned(client, owner, id, true);
        if (isActive(job.state)) {
          await client.query(`UPDATE jobs SET state='cancelled',attempt=NULL WHERE id=$1`, [id]);
          await usage.release(owner);
        }
        await client.query('DELETE FROM job_secrets WHERE job_id=$1', [id]);
        if (remove) {
          await client.query('UPDATE jobs SET deleted=true WHERE id=$1', [id]);
          await files.markDeleted(owner, [...job.input_ids, ...(job.output_id ? [job.output_id] : [])]);
        }
      });
    },
  };
}
