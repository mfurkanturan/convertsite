import type { FastifyInstance } from 'fastify';
import type { analyticsRepository } from '../infrastructure/repository.js';
import type { Config } from '../../../platform/config.js';

export async function adminRoutes(
  app: FastifyInstance,
  deps: { analytics: ReturnType<typeof analyticsRepository>; config: Config }
) {
  app.get('/api/admin/stats', async (request, reply) => {
    const query = request.query as { secret?: string };
    const headerKey = request.headers['x-admin-key'];
    const secret = query.secret || (typeof headerKey === 'string' ? headerKey : undefined);

    const validSecret = deps.config.adminSecret || deps.config.sessionSecret;
    if (!secret || secret !== validSecret) {
      return reply.code(401).send({ error: 'UNAUTHORIZED' });
    }

    const stats = await deps.analytics.getSummary();
    return reply.send({
      success: true,
      timestamp: new Date().toISOString(),
      data: stats,
    });
  });
}
