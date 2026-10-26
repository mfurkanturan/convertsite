ALTER TABLE worker_heartbeats ADD COLUMN IF NOT EXISTS consecutive_failures integer NOT NULL DEFAULT 0;
