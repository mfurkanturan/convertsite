ALTER TABLE files ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'pdf'
  CHECK (kind IN ('pdf','docx','xlsx','jpg','png','zip','txt'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS options jsonb NOT NULL DEFAULT '{}';
