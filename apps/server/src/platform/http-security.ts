import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { randomUUID, createHash, createHmac } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { Config } from './config.js';
import { AppError, publicError } from './error.js';

declare module 'fastify' { interface FastifyRequest { owner: string; client: string } }

export async function httpSecurity(app: FastifyInstance, config: Config) {
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      // Allow matching origin
      if (origin === config.origin) return cb(null, true);
      // Allow localhost in non-production environments
      if (!config.production && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return cb(null, true);
      }
      cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400,
  });

  await app.register(cookie, { secret: config.sessionSecret });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, { max: 180, timeWindow: '1 minute' });
  app.decorateRequest('owner', '');
  app.decorateRequest('client', '');

  app.addHook('onRequest', async (request, reply) => {
    reply.header('cache-control', 'private, no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.origin;
      if (origin && origin !== config.origin) {
        if (config.production || (!origin.includes('localhost') && !origin.includes('127.0.0.1'))) {
          throw new AppError('FORBIDDEN', 'İstek kaynağı doğrulanamadı.', 403);
        }
      }
    }
    const raw = request.cookies.docly_session;
    const verified = raw ? request.unsignCookie(raw) : null;
    const sid = verified?.valid && verified.value ? verified.value : randomUUID();
    if (!verified?.valid) {
      reply.setCookie('docly_session', sid, {
        path: '/api',
        httpOnly: true,
        secure: config.production,
        sameSite: config.production ? 'none' : 'lax',
        signed: true,
        maxAge: 86400
      });
    }
    request.owner = createHash('sha256').update(sid).digest('hex');
    // Keyed hash: limits per network without storing raw IP addresses.
    request.client = createHmac('sha256', config.sessionSecret).update(`client:${request.ip}`).digest('hex');
  });

  app.setErrorHandler((error, request, reply) => {
    const input = error as { validation?: unknown; statusCode?: number; code?: string; message?: string };
    const safe = input.validation ? new AppError('INVALID_REQUEST', 'İstek alanlarını kontrol et.', 400)
      : input.code?.startsWith('FST_REQ_FILE') || input.code === 'FST_FILES_LIMIT' || input.code === 'FST_PARTS_LIMIT' ? new AppError('LIMIT_EXCEEDED', 'Yükleme sınırı aşıldı.', 413)
      : input.message === 'INVALID_SIGNATURE' ? new AppError('INVALID_DOCUMENT', 'Dosyanın türü ve içeriği uyuşmuyor.', 422)
      : input.message === 'MALICIOUS_PAYLOAD' ? new AppError('MALICIOUS_PAYLOAD', 'Güvenlik taraması: Dosyada şüpheli veya zararlı içerik tespit edildi.', 422)
      : input.statusCode === 429 ? new AppError('RATE_LIMITED', 'Çok fazla istek. Biraz sonra yeniden dene.', 429)
      : input.statusCode === 413 ? new AppError('LIMIT_EXCEEDED', 'Yükleme sınırı aşıldı.', 413)
      : input.statusCode === 415 || input.code === 'FST_INVALID_MULTIPART_CONTENT_TYPE' ? new AppError('UNSUPPORTED_FORMAT', 'Desteklenen dosya multipart olarak gönderilmeli.', 415)
      : publicError(error);
    if (safe.status >= 500) request.log.error({ requestId: request.id, code: safe.code }, 'Request failed');
    void reply.code(safe.status).send({ code: safe.code, message: safe.message, requestId: request.id });
  });
}
