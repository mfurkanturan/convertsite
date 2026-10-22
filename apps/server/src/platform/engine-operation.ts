import { mimeTypes, type ToolId, type ToolOptions, type FileKind, type InputKind } from '@convertsite/contracts';
import type { engineClient } from './engine-client.js';
export function engineOperation(engine: ReturnType<typeof engineClient>, tool: ToolId, resolveInputs: (ids: string[]) => Promise<{ id: string; kind: FileKind }[]>) {
  return async (ids: string[], signal: AbortSignal, options: ToolOptions = {}) => {
    const inputs = await resolveInputs(ids);
    const response = await engine.process(tool, inputs.map((input) => ({ ...input, kind: input.kind as InputKind })), options, signal);
    const kind = response.headers.get('x-output-kind') as FileKind;
    const pages = Number(response.headers.get('x-pdf-pages'));
    if (!response.body || !Object.hasOwn(mimeTypes, kind) || !Number.isSafeInteger(pages) || pages < 0) throw new Error('INVALID_OUTPUT');
    const body = response.body;
    async function* chunks() {
      const reader = body!.getReader();
      try { while (true) { const value = await reader.read(); if (value.done) break; yield value.value; } }
      finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
    }
    return { stream: chunks(), pages, kind };
  };
}
