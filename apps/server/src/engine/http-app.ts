import Fastify, { type FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';
import { toolIds, toolSpecs, InputKindSchema, mimeTypes, type InputKind, type FileKind, type ToolOptions } from '@convertsite/contracts';
import { timingSafeEqual } from 'node:crypto';
import { mkdtemp, rm, stat, realpath } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { runPython, EngineFailure } from './process-runner.js';

interface Input { id: string; kind: InputKind }
interface TaskBody { inputs: Input[]; options?: ToolOptions }
function signalFor(reply: FastifyReply) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  reply.raw.once('close', () => { clearTimeout(timer); if (!reply.raw.writableFinished) controller.abort(); });
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}
// Bounded slots with a short wait queue: concurrent uploads wait their turn instead of failing as busy.
function slots(limit: number, queue: number) {
  let active = 0; const waiting: (() => void)[] = [];
  return {
    async acquire(signal: AbortSignal): Promise<boolean> {
      if (signal.aborted) throw new EngineFailure('PROCESSING_TIMEOUT');
      if (active < limit) { active++; return true; }
      if (waiting.length >= queue) return false;
      await new Promise<void>((resolve, reject) => {
        const go = () => { signal.removeEventListener('abort', cancel); resolve(); };
        const cancel = () => { waiting.splice(waiting.indexOf(go), 1); reject(new EngineFailure('PROCESSING_TIMEOUT')); };
        waiting.push(go); signal.addEventListener('abort', cancel, { once: true });
      });
      return true; // the releasing request handed its slot over
    },
    release() { const next = waiting.shift(); if (next) next(); else active--; },
  };
}
export function engineHttpApp(token: string) {
  const app = Fastify({ logger: false, bodyLimit: 16384, requestTimeout: 100000 });
  let processing = false; const inspections = slots(2, 16);
  app.addHook('preHandler', async (request, reply) => {
    if (request.url === '/health') return;
    const given = Buffer.from(request.headers.authorization ?? ''); const expected = Buffer.from(`Bearer ${token}`);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return reply.code(401).send({ error: 'UNAUTHORIZED' });
  });
  app.setErrorHandler((error, _request, reply) => {
    const code = error instanceof EngineFailure ? error.code : 'INVALID_DOCUMENT';
    void reply.code(422).send({ error: code });
  });
  app.get('/health', async () => ({ status: 'ok', tools: toolIds }));
  const inputSchema = Type.Object({ id: Type.String({ format: 'uuid' }), kind: InputKindSchema }, { additionalProperties: false });
  app.post<{ Body: { id: string; kind?: InputKind } }>('/inspect', {
    schema: { body: Type.Object({ id: Type.String({ format: 'uuid' }), kind: Type.Optional(InputKindSchema) }, { additionalProperties: false }) },
  }, async (request, reply) => {
    const operation = signalFor(reply);
    try {
      if (!await inspections.acquire(operation.signal)) return reply.code(503).send({ error: 'ENGINE_BUSY' });
      try {
        const output = await runPython({ tool: 'inspect', inputs: [{ id: request.body.id, kind: request.body.kind ?? 'pdf' }] }, operation.signal);
        return JSON.parse(output) as { pages: number };
      } finally { inspections.release(); }
    } finally { operation.clear(); }
  });
  for (const tool of toolIds) {
    const spec = toolSpecs[tool];
    app.post<{ Body: TaskBody }>(`/process/${tool}`, {
      schema: { body: Type.Object({ inputs: Type.Array(inputSchema, { minItems: spec.min, maxItems: spec.max }), options: Type.Optional(spec.options) }, { additionalProperties: false }) },
    }, async (request, reply) => {
      if (processing) return reply.code(503).send({ error: 'ENGINE_BUSY' });
      if (request.body.inputs.some((input) => !spec.inputs.includes(input.kind))) throw new EngineFailure('UNSUPPORTED_FORMAT');
      processing = true;
      const operation = signalFor(reply);
      let directory = '';
      try {
        directory = await mkdtemp(join(tmpdir(), 'docly-'));
        const raw = await runPython({ tool, inputs: request.body.inputs, options: request.body.options ?? {}, directory, maxPages: spec.maxPages }, operation.signal);
        const result = JSON.parse(raw) as { path: string; kind: FileKind; pages: number };
        if (!Object.hasOwn(mimeTypes, result.kind) || !Number.isSafeInteger(result.pages) || result.pages < 0) throw new EngineFailure('INVALID_OUTPUT');
        const output = await realpath(result.path);
        if (!output.startsWith(directory + sep)) throw new EngineFailure('INVALID_OUTPUT');
        const size = (await stat(output)).size;
        if (size < 1 || size > 40 * 1024 * 1024) throw new EngineFailure('LIMIT_EXCEEDED');
        const stream = createReadStream(output);
        stream.once('close', () => { void rm(directory, { recursive: true, force: true }); });
        return reply.type(mimeTypes[result.kind]).header('content-length', size).header('x-output-kind', result.kind).header('x-pdf-pages', result.pages).send(stream);
      } catch (error) { if (directory) await rm(directory, { recursive: true, force: true }); throw error; }
      finally { processing = false; operation.clear(); }
    });
  }
  return app;
}
