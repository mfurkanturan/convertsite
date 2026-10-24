import type { FileStorage } from '../../files/public.js';
import type { HandlerRegistry, JobRepository } from './ports.js';
export function executeJob(deps: { repository: JobRepository; storage: FileStorage; handlers: HandlerRegistry; newId: () => string; maxBytes: number }) {
  return async (id: string, retryCount = 0) => {
    const attempt = deps.newId();
    const job = await deps.repository.claim(id, attempt);
    if (!job) return;
    const controller = new AbortController();
    const watch = setInterval(() => {
      void deps.repository.owned(job.owner, id).then((current) => {
        if (current.state !== 'running' || current.attempt !== attempt || current.expires_at <= new Date()) controller.abort();
      }).catch(() => controller.abort());
    }, 400);
    const outputId = deps.newId();
    try {
      const handler = deps.handlers.get(job.tool);
      if (!handler) throw new Error('ENGINE_UNAVAILABLE');
      const secret = await deps.repository.secretFor(job.id);
      const options = secret ? { ...job.options, password: secret } : job.options;
      const output = await handler.execute(job.input_ids, controller.signal, options);
      const size = await deps.storage.write(outputId, output.stream, deps.maxBytes);
      if (!await deps.storage.signature(outputId, output.kind)) throw new Error('INVALID_OUTPUT');
      const committed = await deps.repository.finish(job, attempt, { id: outputId, size, pages: output.pages, kind: output.kind });
      if (!committed) await deps.storage.remove(outputId);
    } catch (error) {
      // A lost COMMIT acknowledgement must not remove an already published PDF.
      // If the DB cannot be read, leave the object for recovery/orphan cleanup.
      const current = await deps.repository.owned(job.owner, id);
      if (current.state === 'succeeded' && current.output_id === outputId) return;
      await deps.storage.remove(outputId);
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'PROCESSING_FAILED';
      if (code === 'ENGINE_UNAVAILABLE' && retryCount < 2 && !controller.signal.aborted) throw error;
      await deps.repository.fail(job, attempt, code);
    } finally { clearInterval(watch); }
  };
}
