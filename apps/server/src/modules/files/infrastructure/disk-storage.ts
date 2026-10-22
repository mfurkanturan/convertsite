import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, open, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { AppError } from '../../../platform/error.js';
import type { FileStorage } from '../application/ports.js';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function diskStorage(directory: string): FileStorage {
  const path = (id: string) => { if (!uuid.test(id)) throw new Error('Invalid storage key'); return join(directory, `${id}.pdf`); };
  return {
    async write(id, input, maxBytes) {
      await mkdir(directory, { recursive: true });
      let size = 0;
      const limit = new Transform({ transform(chunk: Buffer, _encoding, done) {
        size += chunk.length;
        done(size > maxBytes ? new AppError('LIMIT_EXCEEDED', 'Dosya boyutu sınırı aşıldı.', 413) : null, chunk);
      } });
      try {
        await pipeline(input, limit, createWriteStream(path(id), { flags: 'wx', mode: 0o600 }));
        if (!size) throw new AppError('INVALID_DOCUMENT', 'Boş dosya yüklenemez.', 422);
        return size;
      } catch (error) { await rm(path(id), { force: true }); throw error; }
    },
    async remove(id) { await rm(path(id), { force: true }); },
    open: (id) => createReadStream(path(id)),
    async signature(id, kind = 'pdf') {
      const handle = await open(path(id), 'r');
      try {
        const bytes = Buffer.alloc(8); const { bytesRead } = await handle.read(bytes, 0, 8, 0);
        const signatures = {
          pdf: () => bytes.subarray(0, 5).toString('ascii') === '%PDF-',
          png: () => bytes.toString('hex') === '89504e470d0a1a0a',
          jpg: () => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
          docx: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          xlsx: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          zip: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          txt: () => bytesRead > 0 && !bytes.subarray(0, bytesRead).includes(0),
        };
        return signatures[kind]();
      }
      finally { await handle.close(); }
    },
  };
}
