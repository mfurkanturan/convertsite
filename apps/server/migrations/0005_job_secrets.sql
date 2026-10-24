CREATE TABLE IF NOT EXISTS job_secrets (
  job_id uuid PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  secret bytea NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS job_secrets_expiry ON job_secrets(expires_at);
