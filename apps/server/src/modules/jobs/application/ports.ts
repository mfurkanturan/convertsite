import type { JobRecord } from '../domain/job.js';
import type { ToolId, ToolOptions, FileKind } from '@convertsite/contracts';
import type { FileRecord } from '../../files/public.js';
export interface ToolHandler {
  execute(ids: string[], signal: AbortSignal, options?: ToolOptions): Promise<{ stream: AsyncIterable<Uint8Array>; pages: number; kind?: FileKind }>;
  validate?(files: FileRecord[]): void;
}
export type HandlerRegistry = ReadonlyMap<string, ToolHandler>;
export interface JobRepository {
  create(owner: string, ids: string[], key: string, hash: string, tool?: ToolId, options?: ToolOptions): Promise<JobRecord>;
  owned(owner: string, id: string): Promise<JobRecord>;
  claim(id: string, attempt: string): Promise<JobRecord | null>;
  finish(job: JobRecord, attempt: string, output: { id: string; size: number; pages: number; kind?: FileKind }): Promise<boolean>;
  fail(job: JobRecord, attempt: string, code: string): Promise<void>;
  cancel(owner: string, id: string, remove?: boolean): Promise<void>;
  usesFile(id: string, activeOnly?: boolean): Promise<boolean>;
  expireStale(): Promise<void>;
}
