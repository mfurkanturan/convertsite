import Fastify, { LogController } from 'fastify';
import multipart from '@fastify/multipart';
import type { Context } from './context.js';
import { httpSecurity } from '../platform/http-security.js';
import { fileRoutes } from '../modules/files/public.js';
import { jobRoutes } from '../modules/jobs/public.js';
import { adminRoutes, analyticsRepository } from '../modules/analytics/public.js';
import { fileDeletion } from '../modules/files/public.js';
import { toolIds, toolSpecs } from '@convertsite/contracts';
export async function createHttpApp(ctx: Context, logging = true) {
  const app = Fastify({
    logger: logging ? { level: 'info', redact: ['req.headers.cookie', 'req.headers.authorization'] } : false,
    logController: new LogController({ disableRequestLogging: true }),
    bodyLimit: 16384,
    requestTimeout: 60000,
    // Trust only the configured proxy hops; with 0, X-Forwarded-For is ignored.
    trustProxy: (_address: string, hop: number) => hop < ctx.config.trustProxyHops
  });
  await httpSecurity(app, ctx.config);
  await app.register(multipart, { limits: { files: 1, fields: 1, parts: 2, fileSize: ctx.config.maxFileBytes, fieldNameSize: 50, headerPairs: 32 } });
  app.get('/api/health/live', async () => ({ status: 'ok' }));
  app.get('/api/health/ready', async (_request, reply) => {
    try {
      await ctx.pool.query('SELECT 1');
      const worker = await ctx.pool.query("SELECT name FROM worker_heartbeats WHERE seen_at>now()-interval '20 seconds'");
      const engine = await ctx.engine.healthy();
      return reply.code(worker.rowCount && engine ? 200 : 503).send({ database: true, worker: Boolean(worker.rowCount), engine });
    } catch { return reply.code(503).send({ status: 'unavailable' }); }
  });
  app.get('/api/capabilities', async () => ({ enabledTools: toolIds, maxFileBytes: ctx.config.maxFileBytes, maxFiles: ctx.config.maxFiles,
    maxTotalBytes: ctx.config.maxTotalBytes, maxTotalPages: ctx.config.maxTotalPages, retentionMinutes: ctx.config.retentionMinutes,
    tools: Object.fromEntries(toolIds.map((id) => [id, { inputs: toolSpecs[id].inputs, minFiles: toolSpecs[id].min, maxFiles: toolSpecs[id].max, maxPages: toolSpecs[id].maxPages, note: toolSpecs[id].note }])) }));
  await fileRoutes(app, { ...ctx, deleteFile: fileDeletion(ctx.pool, ctx.config.maxActiveJobs, (id) => ctx.jobs.usesFile(id)) });
  await jobRoutes(app, ctx);
  await adminRoutes(app, { analytics: analyticsRepository(ctx.pool), config: ctx.config });
  return app;
}
