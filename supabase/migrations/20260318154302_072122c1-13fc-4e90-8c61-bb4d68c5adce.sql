-- Backfill activity_log for all existing events that have empty logs
-- Use created_at as the timestamp and try to resolve actor from created_by -> profiles
UPDATE events
SET activity_log = jsonb_build_array(
  jsonb_build_object(
    'actor', COALESCE(
      (SELECT COALESCE(p.full_name || COALESCE(' ' || p.surname, ''), 'System')
       FROM profiles p WHERE p.id = events.created_by),
      'System'
    ),
    'action', 'Created this event',
    'timestamp', to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  )
)
WHERE (activity_log IS NULL OR activity_log = '[]'::jsonb)
AND deleted_at IS NULL;