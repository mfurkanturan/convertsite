import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import type { FastifyInstance } from 'fastify';
import { CreateJobSchema, IdSchema, mimeTypes, type CreateJob, type JobView } from '@convertsite/contracts';
import type { JobRepository } from '../application/ports.js';
import type { JobRecord } from '../domain/job.js';
import type { FileRepository, FileStorage } from '../../files/public.js';
import { AppError } from '../../../platform/error.js';
export function view(job: JobRecord): JobView {
  return { id: job.id, tool: job.tool, state: job.state, error: job.error,
    resultAvailable: job.state === 'succeeded' && !job.deleted && job.expires_at > new Date(),
    expiresAt: job.expires_at.toISOString(), createdAt: job.created_at.toISOString() };
}
export async function jobRoutes(app: FastifyInstance, deps: { jobs: JobRepository; files: FileRepository; storage: FileStorage }) {
  async function ownedView(owner: string, id: string) {
    const job = await deps.jobs.owned(owner, id);
    const result = view(job);
    if (result.resultAvailable && job.output_id) {
      try { const file = await deps.files.owned(owner, job.output_id); return { ...result, resultKind: file.kind ?? 'pdf', resultSize: file.size }; }
      catch (error) { if (error instanceof AppError && error.status === 404) return { ...result, resultAvailable: false }; throw error; }
    }
    return result;
  }
  app.post<{ Body: CreateJob }>('/api/jobs', { schema: { body: CreateJobSchema } }, async (request, reply) => {
    const { fileIds, idempotencyKey, tool, options = {} } = request.body;
    const normalized = Object.fromEntries(Object.entries(options).sort(([a], [b]) => a.localeCompare(b)));
    const hash = createHash('sha256').update(JSON.stringify({ tool, fileIds, options: normalized })).digest('hex');
    const job = await deps.jobs.create(request.owner, fileIds, idempotencyKey, hash, tool, options);
    return reply.code(202).send(view(job));
  });
  app.get<{ Params: { id: string } }>('/api/jobs/:id', { schema: { params: IdSchema } }, async (request) => ownedView(request.owner, request.params.id));
  app.post<{ Params: { id: string } }>('/api/jobs/:id/cancel', { schema: { params: IdSchema } }, async (request) => {
    await deps.jobs.cancel(request.owner, request.params.id); return view(await deps.jobs.owned(request.owner, request.params.id));
  });
  app.delete<{ Params: { id: string } }>('/api/jobs/:id', { schema: { params: IdSchema } }, async (request, reply) => {
    await deps.jobs.cancel(request.owner, request.params.id, true); return reply.code(202).send({ status: 'deletion-requested', physicalDeletionGraceSeconds: 120 });
  });
  app.get<{ Params: { id: string } }>('/api/jobs/:id/download', { schema: { params: IdSchema } }, async (request, reply) => {
    const job = await deps.jobs.owned(request.owner, request.params.id);
    if (!view(job).resultAvailable || !job.output_id) throw new AppError('RESULT_UNAVAILABLE', 'Sonuç henüz hazır değil veya süresi doldu.', 410);
    const file = await deps.files.owned(request.owner, job.output_id);
    const kind = file.kind ?? 'pdf';
    return reply.type(mimeTypes[kind]).header('content-length', file.size).header('content-disposition', `attachment; filename="doctorconverter-${job.tool}.${kind}"`).send(Readable.from(deps.storage.open(file.id)));
  });
}
