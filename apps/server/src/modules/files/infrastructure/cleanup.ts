import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type pg from 'pg';
import type { FileStorage } from '../application/ports.js';
export function fileCleanup(pool: pg.Pool, storage: FileStorage, directory: string, protectedFile: (id: string) => Promise<boolean>) {
  return async () => {
    const candidates = await pool.query<{ id: string }>('SELECT id FROM files WHERE NOT purged AND expires_at<=now() ORDER BY expires_at LIMIT 100');
    for (const { id } of candidates.rows) {
      if (await protectedFile(id)) continue;
      const client = await pool.connect();
      let remove = false;
      try {
        await client.query('BEGIN');
        const current = await client.query('SELECT id FROM files WHERE id=$1 AND NOT purged AND expires_at<=now() FOR UPDATE', [id]);
        if (current.rowCount) {
          await client.query("UPDATE files SET status='deleted' WHERE id=$1", [id]);
          remove = true;
        }
        await client.query('COMMIT');
      } catch (error) { await client.query('ROLLBACK'); throw error; }
      finally { client.release(); }
      if (remove) {
        await storage.remove(id);
        await pool.query('UPDATE files SET purged=true WHERE id=$1', [id]);
      }
    }
    const entries = await readdir(directory).catch(() => [] as string[]);
    for (const name of entries) {
      if (!/^[0-9a-f-]{36}\.pdf$/.test(name)) continue;
      const id = name.slice(0, -4);
      const info = await stat(join(directory, name)).catch(() => null);
      if (!info || info.mtimeMs > Date.now() - 3600000) continue;
      const exists = await pool.query('SELECT id FROM files WHERE id=$1', [id]);
      if (!exists.rowCount) await storage.remove(id);
    }
  };
}
