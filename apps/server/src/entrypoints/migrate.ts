import { readFile, readdir } from 'node:fs/promises';
import { getConfig } from '../platform/config.js';
import { connectDatabase, transaction } from '../platform/database.js';
const { pool } = connectDatabase(getConfig().databaseUrl);
try {
  await transaction(pool, async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(834221)');
    await client.query('CREATE TABLE IF NOT EXISTS app_migrations (id text PRIMARY KEY, applied_at timestamptz DEFAULT now())');
    const directory = new URL('../../migrations/', import.meta.url);
    for (const filename of (await readdir(directory)).filter((name) => /^\d{4}_[a-z_]+\.sql$/.test(name)).sort()) {
      if (!(await client.query('SELECT id FROM app_migrations WHERE id=$1', [filename])).rowCount) {
        await client.query(await readFile(new URL(filename, directory), 'utf8'));
        await client.query('INSERT INTO app_migrations(id) VALUES ($1)', [filename]);
      }
    }
  });
  console.log('Database migrations complete.');
} finally { await pool.end(); }
