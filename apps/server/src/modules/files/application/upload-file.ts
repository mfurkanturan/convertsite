import type { UploadedFile, InputKind, FileKind } from '@convertsite/contracts';
import type { FileRepository, FileStorage } from './ports.js';
export interface UploadDependencies {
  repository: FileRepository; storage: FileStorage;
  reserve: (owner: string, client: string, id: string, expires: Date, kind?: FileKind) => Promise<void>;
  inspect: (id: string, kind?: InputKind, password?: string) => Promise<number>;
  newId: () => string; expires: () => Date; maxBytes: number;
}
export function uploadFile(deps: UploadDependencies) {
  return async (owner: string, client: string, input: AsyncIterable<Uint8Array>, kind: InputKind = 'pdf', password?: string): Promise<UploadedFile> => {
    const id = deps.newId(); const expiresAt = deps.expires();
    await deps.reserve(owner, client, id, expiresAt, kind);
    try {
      const size = await deps.storage.write(id, input, deps.maxBytes);
      if (!await deps.storage.signature(id, kind)) throw new Error('INVALID_SIGNATURE');
      const scan = await deps.storage.scanPayload(id, kind);
      if (!scan.clean) throw new Error('MALICIOUS_PAYLOAD');
      const pages = await deps.inspect(id, kind, password);
      await deps.repository.ready(id, size, pages);
      return { id, size, pages, expiresAt: expiresAt.toISOString(), kind };
    } catch (error) {
      await deps.repository.markDeleted(owner, [id]);
      await deps.storage.remove(id);
      throw error;
    }
  };
}
