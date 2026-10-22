ALTER TABLE files ADD COLUMN IF NOT EXISTS purged boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS files_cleanup ON files(expires_at) WHERE NOT purged;
