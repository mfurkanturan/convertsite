ALTER TABLE files ADD COLUMN IF NOT EXISTS client text;
CREATE INDEX IF NOT EXISTS files_client ON files(client) WHERE status <> 'deleted';
