import { createContext } from '../bootstrap/context.js';
import { queueName } from '../modules/jobs/public.js';
import { fileCleanup } from '../modules/files/public.js';
const ctx = await createContext();
const cleanFiles = fileCleanup(ctx.pool, ctx.storage, ctx.config.dataDir, (id) => ctx.jobs.usesFile(id, true));
let cleaning = false;
async function maintenance() {
  if (cleaning) return;
  cleaning = true;
  try {
    await ctx.pool.query(`INSERT INTO worker_heartbeats(name,seen_at) VALUES('document-worker',now()) ON CONFLICT(name) DO UPDATE SET seen_at=now()`);
    await ctx.jobs.expireStale(); await cleanFiles();
    await ctx.pool.query(`UPDATE worker_heartbeats SET consecutive_failures=0 WHERE name='document-worker'`);
  } catch {
    console.error('Worker maintenance failed.');
    await ctx.pool.query(`UPDATE worker_heartbeats SET consecutive_failures=consecutive_failures+1 WHERE name='document-worker'`).catch(() => {});
  }
  finally { cleaning = false; }
}
await maintenance();
const timer = setInterval(() => { void maintenance(); }, Math.min(ctx.config.cleanupIntervalMs, 5000));
await ctx.boss.work<{ id: string }>(queueName, { batchSize: 1, pollingIntervalSeconds: 1, includeMetadata: true }, async (jobs) => {
  for (const job of jobs) {
    const started = Date.now();
    await ctx.execute(job.data.id, job.retryCount);
    console.log(JSON.stringify({ event: 'job-delivery-finished', jobId: job.data.id, durationMs: Date.now() - started, retryCount: job.retryCount }));
  }
});
console.log('Document worker ready.');
async function shutdown() { clearInterval(timer); await ctx.close(); }
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });
