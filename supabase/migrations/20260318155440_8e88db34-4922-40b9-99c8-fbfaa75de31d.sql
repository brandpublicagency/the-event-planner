-- Set created_by for all events where it's null (these were created by LeRoux)
UPDATE events SET created_by = '3e90f521-fc6a-43ca-a23e-83b3d5cb252d' WHERE created_by IS NULL;

-- Fix activity_log: replace "System" actor with "LeRoux" for created_by = LeRoux's ID
UPDATE events 
SET activity_log = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'actor' = 'System' THEN jsonb_set(elem, '{actor}', '"LeRoux"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(activity_log::jsonb) AS elem
)
WHERE created_by = '3e90f521-fc6a-43ca-a23e-83b3d5cb252d'
  AND activity_log IS NOT NULL
  AND activity_log::text LIKE '%"System"%';

-- Fix activity_log: replace "Anasha Boshoff" with "Anasha"
UPDATE events 
SET activity_log = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'actor' = 'Anasha Boshoff' THEN jsonb_set(elem, '{actor}', '"Anasha"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(activity_log::jsonb) AS elem
)
WHERE created_by = '7478bf12-a1e6-4890-a797-55316af58988'
  AND activity_log IS NOT NULL
  AND activity_log::text LIKE '%Anasha Boshoff%';

-- Fix notification descriptions
UPDATE notifications SET description = regexp_replace(description, '^System created', 'LeRoux created') WHERE description LIKE 'System created%';
UPDATE notifications SET description = regexp_replace(description, '^Anasha Boshoff created', 'Anasha created') WHERE description LIKE 'Anasha Boshoff created%';