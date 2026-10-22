import type { JobState } from '@convertsite/contracts';
import type { ToolOptions } from '@convertsite/contracts';
export interface JobRecord {
  id: string; owner: string; tool: string; state: JobState;
  input_ids: string[]; output_id: string | null; request_hash: string;
  attempt: string | null; error: string | null; deleted: boolean;
  created_at: Date; expires_at: Date;
  options: ToolOptions;
}
export function isActive(state: JobState): boolean { return state === 'queued' || state === 'running'; }
