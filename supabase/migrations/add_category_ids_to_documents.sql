
-- Add category_ids array column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}';
