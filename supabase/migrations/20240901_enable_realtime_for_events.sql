
-- Enable full replica identity for the events table
ALTER TABLE events REPLICA IDENTITY FULL;

-- Add the events table to the realtime publication
BEGIN;
  -- Check if the publication exists
  SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime';
  
  -- Add to existing publication if it exists
  DO $$
  BEGIN
    IF FOUND THEN
      -- Publication exists, add the table
      ALTER PUBLICATION supabase_realtime ADD TABLE events;
    ELSE
      -- Create the publication if it doesn't exist
      CREATE PUBLICATION supabase_realtime FOR TABLE events;
    END IF;
  END $$;
COMMIT;
