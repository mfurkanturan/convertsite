CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY,
  owner text NOT NULL,
  size bigint NOT NULL CHECK (size > 0),
  pages integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('pending', 'ready', 'deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS files_owner ON files(owner);
CREATE INDEX IF NOT EXISTS files_expiry ON files(expires_at) WHERE status <> 'deleted';
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY,
  owner text NOT NULL,
  tool text NOT NULL,
  state text NOT NULL CHECK (state IN ('queued','running','succeeded','failed','cancelled')),
  input_ids uuid[] NOT NULL,
  output_id uuid REFERENCES files(id),
  idempotency_key uuid NOT NULL,
  request_hash text NOT NULL,
  attempt uuid,
  error text,
  deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE(owner, idempotency_key)
);
CREATE INDEX IF NOT EXISTS jobs_owner ON jobs(owner);
CREATE INDEX IF NOT EXISTS jobs_expiry ON jobs(expires_at);
CREATE INDEX IF NOT EXISTS jobs_inputs ON jobs USING gin(input_ids);
CREATE TABLE IF NOT EXISTS usage_accounts (
  owner text PRIMARY KEY,
  active_jobs integer NOT NULL DEFAULT 0 CHECK (active_jobs >= 0)
);
CREATE TABLE IF NOT EXISTS worker_heartbeats (name text PRIMARY KEY, seen_at timestamptz NOT NULL);
