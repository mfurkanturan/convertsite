import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { analyticsRepository } from '../infrastructure/repository.js';
import type { Config } from '../../../platform/config.js';

const digest = (value: string) => createHash('sha256').update(value).digest();

// The key is accepted only in the x-admin-key header: query strings end up in proxy and access logs.
// With no ADMIN_SECRET configured the endpoint stays disabled instead of reusing SESSION_SECRET.
function validKey(provided: unknown, secret: string): boolean {
  if (!secret || typeof provided !== 'string' || !provided) return false;
  return timingSafeEqual(digest(provided), digest(secret));
}

export async function adminRoutes(
  app: FastifyInstance,
  deps: { analytics: ReturnType<typeof analyticsRepository>; config: Config }
) {
  app.get('/api/admin/stats', async (request, reply) => {
    if (!validKey(request.headers['x-admin-key'], deps.config.adminSecret)) {
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
