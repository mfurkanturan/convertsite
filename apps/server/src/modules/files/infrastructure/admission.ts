import type pg from 'pg';
import type { FileKind } from '@convertsite/contracts';
import { transaction } from '../../../platform/database.js';
import { AppError } from '../../../platform/error.js';
import { fileRepository } from './repository.js';
import { usageRepository } from '../../usage/public.js';

export interface StorageLimits { owner: number; client: number; global: number }
export function uploadAdmission(pool: pg.Pool, limits: StorageLimits) {
  return (owner: string, network: string, id: string, expiresAt: Date, kind: FileKind = 'pdf') => transaction(pool, async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(834222)');
    // New sessions are free, so the network (keyed IP hash) caps how much of the global budget one source can hold.
    const { rows: [count] } = await client.query<{ owner: string; client: string; total: string }>(
      `SELECT count(*) FILTER (WHERE owner=$1) AS owner, count(*) FILTER (WHERE client=$2) AS client, count(*) AS total FROM files WHERE status<>'deleted'`, [owner, network]);
    if (Number(count.owner) >= limits.owner) throw new AppError('LIMIT_EXCEEDED', 'Dosya depolama sınırı doldu. Eski dosyaları sil veya sürelerinin dolmasını bekle.', 429);
    if (Number(count.client) >= limits.client) throw new AppError('LIMIT_EXCEEDED', 'Bu ağdan çok fazla dosya saklanıyor. Eski dosyaları sil veya sürelerinin dolmasını bekle.', 429);
    if (Number(count.total) >= limits.global) throw new AppError('CAPACITY_EXCEEDED', 'Sunucu depolama kapasitesi şu an dolu. Birkaç dakika sonra yeniden dene.', 503);
    await fileRepository(client).insert({ id, owner, client: network, size: 1, pages: 0, status: 'pending', expiresAt, kind });
  });
}
export function fileDeletion(pool: pg.Pool, maxActiveJobs: number, usedByJob: (id: string) => Promise<boolean>) {
  return (owner: string, id: string) => transaction(pool, async (client) => {
    const files = fileRepository(client);
    await usageRepository(client, maxActiveJobs).lock(owner);
    await files.lockInputs(owner, [id]);
    if (await usedByJob(id)) throw new AppError('FILE_IN_USE', 'Dosya bir işleme ait. İşlemi sil.', 409);
    await files.markDeleted(owner, [id]);
  });
}
