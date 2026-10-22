import type { FileKind } from '@convertsite/contracts';
export interface FileRecord { id: string; owner: string; size: number; pages: number; status: string; expiresAt: Date; kind?: FileKind }
export interface FileRepository {
  insert(record: FileRecord): Promise<void>;
  ready(id: string, size: number, pages: number): Promise<void>;
  owned(owner: string, id: string): Promise<FileRecord>;
  lockInputs(owner: string, ids: string[]): Promise<FileRecord[]>;
  protect(ids: string[], until: Date): Promise<void>;
  markDeleted(owner: string, ids: string[]): Promise<void>;
  workerInputs(ids: string[]): Promise<{ id: string; kind: FileKind }[]>;
}
export interface FileStorage {
  write(id: string, input: AsyncIterable<Uint8Array>, maxBytes: number): Promise<number>;
  remove(id: string): Promise<void>;
  open(id: string): AsyncIterable<Uint8Array>;
  signature(id: string, kind?: FileKind): Promise<boolean>;
}
