import { PgBoss } from 'pg-boss';
import { randomUUID } from 'node:crypto';
import { getConfig } from '../platform/config.js';
import { connectDatabase } from '../platform/database.js';
import { engineClient } from '../platform/engine-client.js';
import { engineOperation } from '../platform/engine-operation.js';
import { toolSpecs, type ToolId } from '@convertsite/contracts';
import { fileRepository, diskStorage, uploadFile, uploadAdmission } from '../modules/files/public.js';
import { usageRepository } from '../modules/usage/public.js';
import { jobRepository, queueName, executeJob, inputPolicy, type HandlerRegistry } from '../modules/jobs/public.js';
import { pdfOperationHandlers } from '../modules/pdf-operations/public.js';
import { conversionHandlers } from '../modules/conversions/public.js';
import { ocrHandlers } from '../modules/ocr/public.js';

export async function createContext() {
  const config = getConfig();
  const { pool } = connectDatabase(config.databaseUrl);
  await pool.query('SELECT 1');
  const boss = new PgBoss({ connectionString: config.databaseUrl, max: 4 });
  boss.on('error', () => { console.error('Queue error; check database connectivity.'); });
  await boss.start();
  await boss.createQueue(queueName, { retryLimit: 2, retryDelay: 5, expireInSeconds: 180 });
  const engine = engineClient(config);
  const files = fileRepository(pool);
  const storage = diskStorage(config.dataDir);
  const admission = (client: Parameters<typeof fileRepository>[0]) => ({ files: fileRepository(client), usage: usageRepository(client, config.maxActiveJobs) });
  const factory = (tool: ToolId) => ({ execute: engineOperation(engine, tool, (ids) => files.workerInputs(ids)), validate: inputPolicy(toolSpecs[tool]) });
  const handlers: HandlerRegistry = new Map([...pdfOperationHandlers(factory), ...conversionHandlers(factory), ...ocrHandlers(factory)]);
  const jobs = jobRepository(pool, boss, config, admission, handlers);
  const upload = uploadFile({ repository: files, storage, inspect: engine.inspect, newId: randomUUID, maxBytes: config.maxFileBytes,
    expires: () => new Date(Date.now() + config.retentionMinutes * 60000),
    reserve: uploadAdmission(pool, { owner: config.maxStoredFiles, client: config.maxClientFiles, global: config.maxGlobalFiles }),
  });
  return {
    config, pool, boss, engine, files, storage, jobs, upload,
    execute: executeJob({ repository: jobs, storage, handlers, newId: randomUUID, maxBytes: config.maxTotalBytes }),
    async close() { await boss.stop({ graceful: true, timeout: 100000 }); await pool.end(); },
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
