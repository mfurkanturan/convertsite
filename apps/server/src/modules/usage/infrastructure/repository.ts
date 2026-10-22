import type { SqlClient } from '../../../platform/database.js';
import { AppError } from '../../../platform/error.js';
export function usageRepository(client: SqlClient, limit: number) {
  return {
    async lock(owner: string) {
      await client.query('INSERT INTO usage_accounts(owner) VALUES ($1) ON CONFLICT DO NOTHING', [owner]);
      await client.query('SELECT owner FROM usage_accounts WHERE owner=$1 FOR UPDATE', [owner]);
    },
    async reserve(owner: string) {
      const result = await client.query('UPDATE usage_accounts SET active_jobs=active_jobs+1 WHERE owner=$1 AND active_jobs<$2 RETURNING owner', [owner, limit]);
      if (!result.rowCount) throw new AppError('LIMIT_EXCEEDED', 'Aynı anda çok fazla işlem var. Devam eden işlemi bekle.', 429);
    },
    async release(owner: string) { await client.query('UPDATE usage_accounts SET active_jobs=GREATEST(0,active_jobs-1) WHERE owner=$1', [owner]); },
  };
}
