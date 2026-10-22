import { Type, type Static } from '@sinclair/typebox';
import { toolIds, toolSpecs, type ToolId, type ToolOptions, type FileKind } from './tools.js';
export * from './tools.js';

export const CreateJobSchema = Type.Union(toolIds.map((id) => Type.Object({
  tool: Type.Literal(id),
  fileIds: Type.Array(Type.String({ format: 'uuid' }), { minItems: toolSpecs[id].min, maxItems: toolSpecs[id].max, uniqueItems: true }),
  options: Type.Optional(toolSpecs[id].options),
  idempotencyKey: Type.String({ format: 'uuid' }),
}, { additionalProperties: false })));
export interface CreateJob { tool: ToolId; fileIds: string[]; options?: ToolOptions; idempotencyKey: string }
export const IdSchema = Type.Object({ id: Type.String({ format: 'uuid' }) });
export type JobState = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
export interface UploadedFile { id: string; size: number; pages: number; expiresAt: string; kind?: FileKind }
export interface JobView {
  id: string; tool: string; state: JobState; error: string | null;
  resultAvailable: boolean; expiresAt: string; createdAt: string;
  resultKind?: FileKind; resultSize?: number;
}
export interface Capabilities {
  enabledTools: string[]; maxFileBytes: number; maxFiles: number;
  maxTotalBytes: number; maxTotalPages: number; retentionMinutes: number;
  tools?: Record<string, { inputs: string[]; minFiles: number; maxFiles: number; maxPages: number; note: string }>;
}
