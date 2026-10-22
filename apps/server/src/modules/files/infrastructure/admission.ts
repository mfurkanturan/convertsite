import type pg from 'pg';
import type { FileKind } from '@convertsite/contracts';
import { transaction } from '../../../platform/database.js';
import { AppError } from '../../../platform/error.js';
import { fileRepository } from './repository.js';
import { usageRepository } from '../../usage/public.js';

export function uploadAdmission(pool: pg.Pool, maxStoredFiles: number) {
  return (owner: string, id: string, expiresAt: Date, kind: FileKind = 'pdf') => transaction(pool, async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(834222)');
    const count = await client.query<{ count: string }>(`SELECT count(*) FROM files WHERE owner=$1 AND status<>'deleted'`, [owner]);
    const global = await client.query<{ count: string }>(`SELECT count(*) FROM files WHERE status<>'deleted'`);
    if (Number(count.rows[0].count) >= maxStoredFiles || Number(global.rows[0].count) >= 100) throw new AppError('LIMIT_EXCEEDED', 'Dosya depolama sınırı doldu. Eski dosyaları sil veya sürelerinin dolmasını bekle.', 429);
    await fileRepository(client).insert({ id, owner, size: 1, pages: 0, status: 'pending', expiresAt, kind });
  });
}
export function fileDeletion(pool: pg.Pool, maxActiveJobs: number, usedByJob: (id: string) => Promise<boolean>) {
  return (owner: string, id: string) => transaction(pool, async (client) => {
    const files = fileRepository(client);
    await usageRepository(client, maxActiveJobs).lock(owner);
    await files.lockInputs(owner, [id]);
    if (await usedByJob(id)) throw new AppError('FILE_IN_USE', 'Dosya bir işleme ait. İşlemi sil.', 409);
    await files.markDeleted(owner, [id]);
  });
}
