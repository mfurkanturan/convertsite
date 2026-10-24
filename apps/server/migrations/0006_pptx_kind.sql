ALTER TABLE files DROP CONSTRAINT IF EXISTS files_kind_check;
ALTER TABLE files ADD CONSTRAINT files_kind_check
  CHECK (kind IN ('pdf','docx','xlsx','pptx','jpg','png','zip','txt'));
