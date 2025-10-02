-- Add overview JSONB column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS overview JSONB DEFAULT '{
  "panels": [
    {"key": "venue_layout", "title": "Venue Layout", "type": "richtext", "value": "", "imageUrl": ""},
    {"key": "pre_drinks", "title": "Pre-drinks", "type": "list", "items": []},
    {"key": "menu", "title": "Menu", "type": "richtext", "value": ""}
  ],
  "visible": true
}'::jsonb;

-- Create index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_events_overview ON public.events USING gin(overview);