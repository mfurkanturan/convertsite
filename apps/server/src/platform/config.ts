import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from 'node:process';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
try { loadEnvFile(resolve(root, '.env')); } catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}
function integer(name: string, fallback: number, min = 1, max = 1_000_000_000): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new Error(`Invalid configuration: ${name}`);
  return value;
}
export function getConfig() {
  const engineToken = process.env.ENGINE_TOKEN;
  if (!engineToken || engineToken.length < 32) throw new Error('ENGINE_TOKEN must contain at least 32 characters');
  const origin = process.env.APP_ORIGIN ?? 'http://127.0.0.1:4321';
  if (new URL(origin).origin !== origin) throw new Error('APP_ORIGIN must be an origin');
  return {
    root, origin, production: process.env.NODE_ENV === 'production',
    port: integer('API_PORT', 3001, 1024, 65535),
    databaseUrl: process.env.DATABASE_URL ?? 'postgres://docly:docly-local@127.0.0.1:55432/docly',
    dataDir: resolve(root, process.env.DATA_DIR ?? '.data/files'),
    engineUrl: process.env.ENGINE_URL ?? 'http://127.0.0.1:3002', engineToken,
    maxFileBytes: integer('MAX_FILE_BYTES', 10 * 1024 * 1024, 1, 10 * 1024 * 1024),
    maxTotalBytes: integer('MAX_TOTAL_BYTES', 40 * 1024 * 1024, 1, 40 * 1024 * 1024),
    maxFiles: integer('MAX_FILES', 20, 2, 20), maxTotalPages: integer('MAX_TOTAL_PAGES', 300, 1, 300),
    retentionMinutes: integer('RETENTION_MINUTES', 60, 5, 1440),
    maxActiveJobs: integer('MAX_ACTIVE_JOBS', 2, 1, 5),
    maxStoredFiles: integer('MAX_STORED_FILES', 40, 2, 200),
    engineTimeoutMs: integer('ENGINE_TIMEOUT_MS', 95000, 1000, 120000),
    cleanupIntervalMs: integer('CLEANUP_INTERVAL_MS', 30000, 1000, 60000),
  };
}
export type Config = ReturnType<typeof getConfig>;
