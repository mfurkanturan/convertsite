import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
export type SqlClient = Pick<pg.PoolClient, 'query'>;
export function connectDatabase(url: string) {
  const pool = new pg.Pool({ connectionString: url, max: 8, connectionTimeoutMillis: 5000, statement_timeout: 15000 });
  const db = drizzle(pool);
  return { pool, db };
}
export async function transaction<T>(pool: pg.Pool, run: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try { await client.query('BEGIN'); const result = await run(client); await client.query('COMMIT'); return result; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
