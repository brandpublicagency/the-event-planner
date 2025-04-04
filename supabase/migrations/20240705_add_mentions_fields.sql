
-- Add mentions fields to documents table
ALTER TABLE IF EXISTS public.documents 
ADD COLUMN IF NOT EXISTS mentioned_in JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]'::jsonb;

-- Add mentions fields to tasks table
ALTER TABLE IF EXISTS public.tasks 
ADD COLUMN IF NOT EXISTS mentioned_in JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]'::jsonb;

-- Add mentions fields to events table
ALTER TABLE IF EXISTS public.events 
ADD COLUMN IF NOT EXISTS mentioned_in JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.documents.mentions IS 'Contains IDs of items mentioned in this document: [{"id": "uuid", "type": "document|task|event"}]';
COMMENT ON COLUMN public.documents.mentioned_in IS 'Contains IDs of items where this document is mentioned: [{"id": "uuid", "type": "document|task|event"}]';

COMMENT ON COLUMN public.tasks.mentions IS 'Contains IDs of items mentioned in this task: [{"id": "uuid", "type": "document|task|event"}]';
COMMENT ON COLUMN public.tasks.mentioned_in IS 'Contains IDs of items where this task is mentioned: [{"id": "uuid", "type": "document|task|event"}]';

COMMENT ON COLUMN public.events.mentions IS 'Contains IDs of items mentioned in this event: [{"id": "uuid", "type": "document|task|event"}]';
COMMENT ON COLUMN public.events.mentioned_in IS 'Contains IDs of items where this event is mentioned: [{"id": "uuid", "type": "document|task|event"}]';
