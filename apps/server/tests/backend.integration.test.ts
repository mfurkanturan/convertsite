import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { randomUUID, createHash } from 'node:crypto';
import { access, mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { createContext, type Context } from '../src/bootstrap/context.js';
import { createHttpApp } from '../src/bootstrap/http-app.js';
import { fileCleanup, uploadAdmission } from '../src/modules/files/public.js';
import { pdfFixture, multipart } from './pdf-fixture.js';
import type { FastifyInstance } from 'fastify';
import type { JobView, UploadedFile } from '@convertsite/contracts';

describe('real PostgreSQL + pg-boss + isolated QPDF', () => {
  let ctx: Context; let app: FastifyInstance;
  const owners: string[] = [];
  const ownerIds = new Set<string>();
  beforeAll(async () => { ctx = await createContext(); app = await createHttpApp(ctx, false); await app.ready(); }, 30000);
  afterAll(async () => {
    for (const cookie of owners) {
      const response = await app.inject({ url: '/api/capabilities', headers: { cookie } });
      expect(response.statusCode).toBe(200);
    }
    if (ctx && ownerIds.size) {
      const values = [...ownerIds];
      const ids = (await ctx.pool.query<{ id: string }>('SELECT id FROM jobs WHERE owner=ANY($1)', [values])).rows.map((job) => job.id);
      await ctx.pool.query("UPDATE jobs SET deleted=true,state=CASE WHEN state IN ('queued','running') THEN 'cancelled' ELSE state END WHERE owner=ANY($1)", [values]);
      await ctx.pool.query("UPDATE files SET status='deleted',expires_at=now()-interval '1 second' WHERE owner=ANY($1)", [values]);
      await cleanFiles();
      await ctx.pool.query("DELETE FROM pgboss.job WHERE data->>'id'=ANY($1)", [ids]);
      await ctx.pool.query('DELETE FROM jobs WHERE owner=ANY($1)', [values]);
      await ctx.pool.query('DELETE FROM files WHERE owner=ANY($1)', [values]);
      await ctx.pool.query('DELETE FROM usage_accounts WHERE owner=ANY($1)', [values]);
    }
    await app?.close(); await ctx?.close();
  });
  async function session() {
    const response = await app.inject('/api/capabilities');
    const value = response.headers['set-cookie'];
    const cookie = (Array.isArray(value) ? value[0] : value)!.split(';')[0];
    const sid = app.unsignCookie(decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1))).value!;
    ownerIds.add(createHash('sha256').update(sid).digest('hex'));
    owners.push(cookie); return cookie;
  }
  async function upload(cookie: string, width = 300, pages = 1) {
    const part = multipart(await pdfFixture(width, 'Synthetic fixture', pages));
    const response = await app.inject({ method: 'POST', url: '/api/files', headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload });
    expect(response.statusCode, response.body).toBe(201); return response.json<UploadedFile>();
  }
  async function create(cookie: string, fileIds: string[], key = randomUUID()) {
    return app.inject({ method: 'POST', url: '/api/jobs', headers: { cookie, origin: ctx.config.origin }, payload: { tool: 'merge-pdf', fileIds, idempotencyKey: key } });
  }
  async function pair(cookie: string) { return [(await upload(cookie, 300)).id, (await upload(cookie, 500)).id]; }
  function cleanFiles() { return fileCleanup(ctx.pool, ctx.storage, ctx.config.dataDir, (id) => ctx.jobs.usesFile(id, true))(); }

  it('uploads, queues and merges pages in order; result survives a new API instance', async () => {
    const cookie = await session(); const ids = await pair(cookie);
    const response = await create(cookie, ids); expect(response.statusCode).toBe(202);
    const job = response.json<JobView>(); expect(job.state).toBe('queued');
    const queued = await ctx.pool.query("SELECT id FROM pgboss.job WHERE data->>'id'=$1", [job.id]); expect(queued.rowCount).toBe(1);
    await ctx.execute(job.id);
    const another = await createHttpApp(ctx, false);
    try {
      const state = await another.inject({ url: `/api/jobs/${job.id}`, headers: { cookie } });
      expect(state.json<JobView>().state).toBe('succeeded');
      const output = await another.inject({ url: `/api/jobs/${job.id}/download`, headers: { cookie } });
      expect(output.statusCode).toBe(200); expect(output.headers['cache-control']).toContain('no-store');
      const pdf = await PDFDocument.load(output.rawPayload);
      expect(pdf.getPageCount()).toBe(2); expect(pdf.getPages().map((page) => page.getWidth())).toEqual([300, 500]);
    } finally { await another.close(); }
  });
  it('rejects another session on status, download, cancel, and delete', async () => {
    const owner = await session(); const other = await session();
    const job = (await create(owner, await pair(owner))).json<JobView>();
    for (const [method, suffix] of [['GET', ''], ['GET', '/download'], ['POST', '/cancel'], ['DELETE', '']] as const) {
      const response = await app.inject({ method, url: `/api/jobs/${job.id}${suffix}`, headers: { cookie: other, origin: ctx.config.origin } });
      expect(response.statusCode).toBe(404);
    }
    await ctx.jobs.cancel((await ctx.pool.query('SELECT owner FROM jobs WHERE id=$1', [job.id])).rows[0].owner, job.id);
  });
  it('preserves the PDF if completion committed but its acknowledgement was lost', async () => {
    const cookie = await session(); const job = (await create(cookie, await pair(cookie))).json<JobView>();
    const finish = ctx.jobs.finish.bind(ctx.jobs);
    const spy = vi.spyOn(ctx.jobs, 'finish').mockImplementationOnce(async (...args) => {
      await finish(...args); throw new Error('Simulated lost COMMIT acknowledgement');
    });
    try { await ctx.execute(job.id); }
    finally { spy.mockRestore(); }
    expect((await app.inject({ url: `/api/jobs/${job.id}/download`, headers: { cookie } })).statusCode).toBe(200);
  });
  it('serializes duplicate requests and rejects a changed idempotent payload', async () => {
    const cookie = await session(); const ids = await pair(cookie); const key = randomUUID();
    const responses = await Promise.all([create(cookie, ids, key), create(cookie, ids, key)]);
    expect(responses.map((r) => r.statusCode)).toEqual([202, 202]);
    const id = responses[0].json<JobView>().id; expect(responses[1].json<JobView>().id).toBe(id);
    expect((await ctx.pool.query("SELECT id FROM pgboss.job WHERE data->>'id'=$1", [id])).rowCount).toBe(1);
    expect((await create(cookie, [...ids].reverse(), key)).statusCode).toBe(409);
  });
  it('rolls back job and usage when queue admission fails', async () => {
    const cookie = await session(); const ids = await pair(cookie); const key = randomUUID();
    const spy = vi.spyOn(ctx.boss, 'send').mockRejectedValueOnce(new Error('Simulated queue outage'));
    try { expect((await create(cookie, ids, key)).statusCode).toBe(500); }
    finally { spy.mockRestore(); }
    expect((await ctx.pool.query('SELECT id FROM jobs WHERE idempotency_key=$1', [key])).rowCount).toBe(0);
    expect((await create(cookie, ids, key)).statusCode).toBe(202);
  });
  it('cancels work and fences a stale worker from publishing output', async () => {
    const cookie = await session(); const job = (await create(cookie, await pair(cookie))).json<JobView>();
    const first = randomUUID(); const second = randomUUID();
    const claimed = await ctx.jobs.claim(job.id, first); expect(claimed).not.toBeNull();
    await ctx.jobs.claim(job.id, second);
    expect(await ctx.jobs.finish(claimed!, first, { id: randomUUID(), size: 100, pages: 2 })).toBe(false);
    expect((await app.inject({ method: 'POST', url: `/api/jobs/${job.id}/cancel`, headers: { cookie, origin: ctx.config.origin } })).json<JobView>().state).toBe('cancelled');
    expect(await ctx.jobs.finish(claimed!, second, { id: randomUUID(), size: 100, pages: 2 })).toBe(false);
    await ctx.execute(job.id);
    expect((await app.inject({ url: `/api/jobs/${job.id}/download`, headers: { cookie } })).statusCode).toBe(410);
  });
  it('recovers an interrupted application attempt and publishes one result', async () => {
    const cookie = await session(); const job = (await create(cookie, await pair(cookie))).json<JobView>();
    await ctx.jobs.claim(job.id, randomUUID());
    await ctx.execute(job.id); await ctx.execute(job.id);
    expect((await app.inject({ url: `/api/jobs/${job.id}`, headers: { cookie } })).json<JobView>().state).toBe('succeeded');
    expect((await ctx.pool.query('SELECT output_id FROM jobs WHERE id=$1', [job.id])).rows[0].output_id).toBeTruthy();
  });
  it('denies cross-origin writes and rejects invalid format, corrupt PDF and duplicate ids', async () => {
    expect((await app.inject({ method: 'POST', url: '/api/jobs', headers: { origin: 'https://evil.example' }, payload: {} })).statusCode).toBe(403);
    const cookie = await session();
    for (const [bytes, filename, expected] of [[Buffer.from('text'), 'wrong.txt', 415], [Buffer.from('%PDF-1.4\ncorrupted'), 'broken.pdf', 422]] as const) {
      const part = multipart(bytes, filename);
      expect((await app.inject({ method: 'POST', url: '/api/files', headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload })).statusCode).toBe(expected);
    }
    const id = randomUUID(); expect((await create(cookie, [id, id])).statusCode).toBe(400);
  });
  it('closes access immediately on deletion and physically removes expired files', async () => {
    const cookie = await session(); const ids = await pair(cookie); const job = (await create(cookie, ids)).json<JobView>(); await ctx.execute(job.id);
    const output = (await ctx.pool.query('SELECT output_id FROM jobs WHERE id=$1', [job.id])).rows[0].output_id as string;
    expect((await app.inject({ method: 'DELETE', url: `/api/jobs/${job.id}`, headers: { cookie, origin: ctx.config.origin } })).statusCode).toBe(202);
    expect((await app.inject({ url: `/api/jobs/${job.id}/download`, headers: { cookie } })).statusCode).toBe(404);
    await ctx.pool.query("UPDATE files SET expires_at=now()-interval '1 second' WHERE id=ANY($1::uuid[])", [[...ids, output]]);
    await cleanFiles();
    for (const id of [...ids, output]) await expect(access(join(ctx.config.dataDir, `${id}.pdf`))).rejects.toThrow();
  });
  it('expires abandoned work and releases its active-job reservation', async () => {
    const cookie = await session(); const job = (await create(cookie, await pair(cookie))).json<JobView>();
    await ctx.pool.query("UPDATE jobs SET created_at=now()-interval '11 minutes' WHERE id=$1", [job.id]);
    await ctx.jobs.expireStale();
    const record = (await ctx.pool.query('SELECT owner,state,error FROM jobs WHERE id=$1', [job.id])).rows[0];
    expect(record.state).toBe('failed'); expect(record.error).toBe('PROCESSING_TIMEOUT');
    expect((await ctx.pool.query('SELECT active_jobs FROM usage_accounts WHERE owner=$1', [record.owner])).rows[0].active_jobs).toBe(0);
  });
  it('rejects truncated uploads at the multipart limit without leaving a ready file', async () => {
    const limited = await createHttpApp({ ...ctx, config: { ...ctx.config, maxFileBytes: 512 } }, false);
    const cookie = await session(); const part = multipart(await pdfFixture());
    try {
      const response = await limited.inject({ method: 'POST', url: '/api/files', headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload });
      expect(response.statusCode, response.body).toBe(413);
    } finally { await limited.close(); }
  });
  it('rejects encrypted PDFs in the isolated inspector', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'docly-test-'));
    try {
      await writeFile(join(dir, 'input.pdf'), await pdfFixture());
      await promisify(execFile)('qpdf', ['--encrypt', 'user', 'owner', '256', '--', join(dir, 'input.pdf'), join(dir, 'encrypted.pdf')]);
      const part = multipart(await readFile(join(dir, 'encrypted.pdf'))); const cookie = await session();
      const response = await app.inject({ method: 'POST', url: '/api/files', headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload });
      expect(response.statusCode, response.body).toBe(422);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
  it('enforces aggregate page limits before queue admission', async () => {
    const cookie = await session();
    const ids = [(await upload(cookie, 300, 170)).id, (await upload(cookie, 300, 170)).id];
    expect((await create(cookie, ids)).statusCode).toBe(413);
  });
  it('limits active jobs and releases capacity on cancellation', async () => {
    const cookie = await session();
    const first = (await create(cookie, await pair(cookie))).json<JobView>();
    expect((await create(cookie, await pair(cookie))).statusCode).toBe(202);
    const third = await pair(cookie);
    expect((await create(cookie, third)).statusCode).toBe(429);
    await app.inject({ method: 'POST', url: `/api/jobs/${first.id}/cancel`, headers: { cookie, origin: ctx.config.origin } });
    expect((await create(cookie, third)).statusCode).toBe(202);
  });
  it('queues concurrent uploads in the inspector instead of rejecting them as busy', async () => {
    const part = multipart(await pdfFixture());
    const cookies = await Promise.all([1, 2, 3].map(() => session()));
    const responses = await Promise.all(cookies.map((cookie, index) => app.inject({ method: 'POST', url: '/api/files', remoteAddress: `127.2.0.${index + 1}`,
      headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload })));
    for (const response of responses) expect(response.statusCode, response.body).toBe(201);
  });
  it('keys clients on the configured edge header and ignores forwarded headers by default', async () => {
    const edge = await createHttpApp({ ...ctx, config: { ...ctx.config, clientIpHeader: 'cf-connecting-ip' } }, false);
    const remaining = async (target: FastifyInstance, headers: Record<string, string>) =>
      Number((await target.inject({ url: '/api/capabilities', headers })).headers['x-ratelimit-remaining']);
    try {
      expect(await remaining(edge, { 'cf-connecting-ip': '198.51.100.7' })).toBe(179);
      expect(await remaining(edge, { 'cf-connecting-ip': '198.51.100.7' })).toBe(178);
      expect(await remaining(edge, { 'cf-connecting-ip': '198.51.100.8' })).toBe(179);
    } finally { await edge.close(); }
    const plain = await createHttpApp({ ...ctx, config: { ...ctx.config, trustProxyHops: 0 } }, false);
    try {
      expect(await remaining(plain, { 'x-forwarded-for': '203.0.113.1' })).toBe(179);
      expect(await remaining(plain, { 'x-forwarded-for': '203.0.113.2' })).toBe(178);
    } finally { await plain.close(); }
  });
  it('caps stored files per network across fresh sessions and enforces the global budget', async () => {
    const network = randomUUID(); const expires = new Date(Date.now() + 60000);
    const sessions = [randomUUID(), randomUUID(), randomUUID()]; sessions.forEach((owner) => ownerIds.add(owner));
    const reserve = uploadAdmission(ctx.pool, { owner: 40, client: 2, global: 100000 });
    await reserve(sessions[0], network, randomUUID(), expires);
    await reserve(sessions[1], network, randomUUID(), expires);
    await expect(reserve(sessions[2], network, randomUUID(), expires)).rejects.toMatchObject({ code: 'LIMIT_EXCEEDED', status: 429 });
    await expect(uploadAdmission(ctx.pool, { owner: 40, client: 40, global: 2 })(sessions[2], randomUUID(), randomUUID(), expires))
      .rejects.toMatchObject({ code: 'CAPACITY_EXCEEDED', status: 503 });
  });
  it('protects and unlocks PDFs end-to-end without persisting the password', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'docly-pass-'));
    try {
      const plain = await pdfFixture(300, 'Secret content', 1);
      await writeFile(join(dir, 'plain.pdf'), plain);
      const unlockPassword = 'şifreözel-2026!&=';
      await promisify(execFile)('qpdf', ['--encrypt', unlockPassword, 'owner', '256', '--', join(dir, 'plain.pdf'), join(dir, 'encrypted.pdf')]);
      const cookie = await session();
      const remote = '10.7.7.7';

      // Wrong and missing passwords are rejected before the encrypted upload becomes ready.
      for (const password of ['wrong-password', undefined]) {
        const rejectedUpload = multipart(await readFile(join(dir, 'encrypted.pdf')), 'encrypted.pdf', 'application/pdf', password ? { password } : {});
        const rejected = await app.inject({ method: 'POST', url: '/api/files', remoteAddress: remote, headers: { cookie, origin: ctx.config.origin, 'content-type': rejectedUpload.contentType }, payload: rejectedUpload.payload });
        expect(rejected.statusCode, rejected.body).toBe(422);
      }

      // Correct Unicode/special-character password travels through upload, job secret and worker.
      const unlockUpload = multipart(await readFile(join(dir, 'encrypted.pdf')), 'encrypted.pdf', 'application/pdf', { password: unlockPassword });
      const uploadRes = await app.inject({ method: 'POST', url: '/api/files', remoteAddress: remote, headers: { cookie, origin: ctx.config.origin, 'content-type': unlockUpload.contentType }, payload: unlockUpload.payload });
      expect(uploadRes.statusCode, uploadRes.body).toBe(201);
      const unlockJobRes = await app.inject({ method: 'POST', url: '/api/jobs', headers: { cookie, origin: ctx.config.origin }, payload: { tool: 'unlock-pdf', fileIds: [uploadRes.json<UploadedFile>().id], options: { password: unlockPassword }, idempotencyKey: randomUUID() } });
      expect(unlockJobRes.statusCode, unlockJobRes.body).toBe(202);
      const unlockJob = unlockJobRes.json<JobView>();
      await ctx.execute(unlockJob.id);
      const unlocked = await app.inject({ url: `/api/jobs/${unlockJob.id}/download`, headers: { cookie } });
      expect(unlocked.statusCode).toBe(200);
      await writeFile(join(dir, 'unlocked.pdf'), unlocked.rawPayload);
      expect((await promisify(execFile)('pdftotext', [join(dir, 'unlocked.pdf'), '-'])).stdout).toContain('Secret content');

      // protect: encrypt a plain PDF; password round-trips through an encrypted secret and is cleaned up after finish.
      const plainUpload = multipart(plain, 'plain.pdf', 'application/pdf');
      const plainRes = await app.inject({ method: 'POST', url: '/api/files', remoteAddress: remote, headers: { cookie, origin: ctx.config.origin, 'content-type': plainUpload.contentType }, payload: plainUpload.payload });
      expect(plainRes.statusCode, plainRes.body).toBe(201);
      const protectPassword = 'yeni-şifre-2026!&=';
      const protectRes = await app.inject({ method: 'POST', url: '/api/jobs', headers: { cookie, origin: ctx.config.origin }, payload: { tool: 'protect-pdf', fileIds: [plainRes.json<UploadedFile>().id], options: { password: protectPassword }, idempotencyKey: randomUUID() } });
      expect(protectRes.statusCode, protectRes.body).toBe(202);
      const protectJob = protectRes.json<JobView>();
      expect(await ctx.jobs.secretFor(protectJob.id)).toBe(protectPassword);
      const stored = (await ctx.pool.query('SELECT options FROM jobs WHERE id=$1', [protectJob.id])).rows[0];
      expect(JSON.stringify(stored.options)).not.toContain(protectPassword);
      await ctx.execute(protectJob.id);
      const protectedPdf = await app.inject({ url: `/api/jobs/${protectJob.id}/download`, headers: { cookie } });
      expect(protectedPdf.statusCode).toBe(200);
      await writeFile(join(dir, 'protected.pdf'), protectedPdf.rawPayload);
      await promisify(execFile)('qpdf', ['--is-encrypted', join(dir, 'protected.pdf')]);
      await promisify(execFile)('qpdf', [`--password=${protectPassword}`, '--check', join(dir, 'protected.pdf')]);
      expect(await ctx.jobs.secretFor(protectJob.id)).toBeNull();
      await ctx.pool.query(`INSERT INTO job_secrets(job_id,secret,expires_at) VALUES($1,$2,now()+interval '1 hour')`, [protectJob.id, Buffer.from('synthetic-test-secret')]);
      await ctx.jobs.expireStale();
      expect((await ctx.pool.query('SELECT 1 FROM job_secrets WHERE job_id=$1', [protectJob.id])).rowCount).toBe(0);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
