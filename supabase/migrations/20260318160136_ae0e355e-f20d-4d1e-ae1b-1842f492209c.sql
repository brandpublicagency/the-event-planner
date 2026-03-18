-- Revert created_by to NULL for website-created events (those with terms & conditions)
UPDATE events SET created_by = NULL WHERE event_notes IS NOT NULL AND event_notes != '';

-- Fix activity_log: replace "LeRoux" actor with "System" for "Created this event" entries on website events
UPDATE events 
SET activity_log = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'actor' = 'LeRoux' AND elem->>'action' = 'Created this event'
      THEN jsonb_set(elem, '{actor}', '"System"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(activity_log::jsonb) AS elem
)
WHERE event_notes IS NOT NULL AND event_notes != ''
  AND activity_log IS NOT NULL
  AND activity_log::text LIKE '%"LeRoux"%';

-- Fix notification descriptions: revert "LeRoux created" back to "System created" for website events
UPDATE notifications 
SET description = regexp_replace(description, '^LeRoux created', 'System created')
WHERE description LIKE 'LeRoux created%'
  AND event_code IN (SELECT event_code FROM events WHERE event_notes IS NOT NULL AND event_notes != '');