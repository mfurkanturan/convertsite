import { and, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type pg from 'pg';
import { AppError } from '../../../platform/error.js';
import type { FileRepository } from '../application/ports.js';
import { filesTable as table } from './schema.js';
export function fileRepository(client: pg.Pool | pg.PoolClient): FileRepository {
  const db = drizzle(client);
  return {
    async workerInputs(ids) {
      const records = await db.select().from(table).where(inArray(table.id, ids));
      if (records.length !== ids.length || records.some((record) => record.status !== 'ready' || record.expiresAt <= new Date())) throw new AppError('NOT_FOUND', 'Girdi bulunamadı.', 404);
      return ids.map((id) => { const record = records.find((item) => item.id === id)!; return { id, kind: record.kind }; });
    },
    async insert(record) { await db.insert(table).values(record); },
    async ready(id, size, pages) { await db.update(table).set({ status: 'ready', size, pages }).where(eq(table.id, id)); },
    async owned(owner, id) {
      const [record] = await db.select().from(table).where(and(eq(table.id, id), eq(table.owner, owner)));
      if (!record || record.status !== 'ready' || record.expiresAt <= new Date()) throw new AppError('NOT_FOUND', 'Dosya bulunamadı.', 404);
      return record;
    },
    async lockInputs(owner, ids) {
      const records = await db.select().from(table).where(and(inArray(table.id, ids), eq(table.owner, owner))).for('update');
      if (records.length !== ids.length || records.some((file) => file.status !== 'ready' || file.expiresAt <= new Date())) throw new AppError('NOT_FOUND', 'Girdi dosyası bulunamadı.', 404);
      return ids.map((id) => records.find((file) => file.id === id)!);
    },
    async protect(ids, until) { await db.update(table).set({ expiresAt: until }).where(inArray(table.id, ids)); },
    async markDeleted(owner, ids) { if (ids.length) await db.update(table).set({ status: 'deleted', expiresAt: new Date(Date.now() + 120000) }).where(and(eq(table.owner, owner), inArray(table.id, ids))); },
  };
}
