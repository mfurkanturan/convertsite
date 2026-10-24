import type { FastifyInstance } from 'fastify';
import type { UploadedFile, InputKind } from '@convertsite/contracts';
import { IdSchema, mimeTypes } from '@convertsite/contracts';
import type { FileRepository, FileStorage } from '../application/ports.js';
import { AppError } from '../../../platform/error.js';
import type { Config } from '../../../platform/config.js';
export async function fileRoutes(app: FastifyInstance, deps: {
  config: Config; files: FileRepository; storage: FileStorage;
  upload: (owner: string, client: string, stream: AsyncIterable<Uint8Array>, kind?: InputKind, password?: string) => Promise<UploadedFile>;
  deleteFile: (owner: string, id: string) => Promise<void>;
}) {
  app.post('/api/files', { config: { rateLimit: { max: 30, timeWindow: '1 hour' } } }, async (request, reply) => {
    const parts = request.parts(); let uploaded: UploadedFile | undefined; let password: string | undefined;
    try {
      for await (const part of parts) {
        if (part.type === 'field' && part.fieldname === 'password') {
          password = String(part.value ?? '').slice(0, 64);
          continue;
        }
        const extension = part.type === 'file' ? part.filename.toLowerCase().split('.').at(-1) : '';
        const kind = (extension === 'jpeg' ? 'jpg' : extension) as InputKind;
        if (part.type !== 'file' || part.fieldname !== 'file' || !['pdf','docx','xlsx','pptx','jpg','png'].includes(kind) || ![mimeTypes[kind], 'application/octet-stream'].includes(part.mimetype)) {
          if (part.type === 'file') part.file.resume();
          throw new AppError('UNSUPPORTED_FORMAT', 'PDF, DOCX, XLSX, PPTX, JPG veya PNG dosyası seç.', 415);
        }
        const fileStream = part.file;
        async function* content() {
          for await (const chunk of fileStream) yield chunk as Uint8Array;
          if (fileStream.truncated) throw new AppError('LIMIT_EXCEEDED', 'Dosya boyutu sınırı aşıldı.', 413);
        }
        uploaded = await deps.upload(request.owner, request.client, content(), kind, password);
        if (part.file.truncated) throw new AppError('LIMIT_EXCEEDED', 'Dosya boyutu sınırı aşıldı.', 413);
      }
      if (!uploaded) throw new AppError('INVALID_REQUEST', 'Dosya seçilmedi.', 400);
      return reply.code(201).send(uploaded);
    } catch (error) {
      if (uploaded) { await deps.files.markDeleted(request.owner, [uploaded.id]); await deps.storage.remove(uploaded.id); }
      throw error;
    }
  });
  app.delete<{ Params: { id: string } }>('/api/files/:id', { schema: { params: IdSchema } }, async (request, reply) => {
    await deps.deleteFile(request.owner, request.params.id); return reply.code(204).send();
  });
}
