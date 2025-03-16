
-- Update the document_due_reminder trigger to be event-date based (with event_relative = true)
UPDATE notification_triggers
SET 
  event_relative = true, 
  days_offset = 14,
  updated_at = NOW()
WHERE template_type = 'document_due_reminder';

-- Update the final_payment_reminder trigger to be event-date based (with event_relative = true)
UPDATE notification_triggers
SET 
  event_relative = true, 
  days_offset = 7,
  updated_at = NOW()
WHERE template_type = 'final_payment_reminder';

-- Clean up any existing document due reminders for events with dates
WITH events_with_dates AS (
  SELECT e.event_code, e.event_date 
  FROM events e 
  WHERE e.event_date IS NOT NULL
)
UPDATE event_notifications
SET 
  is_completed = true,
  updated_at = NOW()
FROM events_with_dates e
WHERE 
  event_notifications.event_code = e.event_code
  AND notification_type = 'document_due_reminder'
  AND is_completed = false
  AND (
    -- If the notification's scheduled date is not within 12-16 days before the event
    scheduled_for::date < (e.event_date - INTERVAL '16 days')::date
    OR scheduled_for::date > (e.event_date - INTERVAL '12 days')::date
  );

-- Clean up any existing final payment reminders for events with dates
WITH events_with_dates AS (
  SELECT e.event_code, e.event_date 
  FROM events e 
  WHERE e.event_date IS NOT NULL
)
UPDATE event_notifications
SET 
  is_completed = true,
  updated_at = NOW()
FROM events_with_dates e
WHERE 
  event_notifications.event_code = e.event_code
  AND notification_type = 'final_payment_reminder'
  AND is_completed = false
  AND (
    -- If the notification's scheduled date is not within 6-8 days before the event
    scheduled_for::date < (e.event_date - INTERVAL '8 days')::date
    OR scheduled_for::date > (e.event_date - INTERVAL '6 days')::date
  );

-- This indicates that the notification system should reschedule the notifications
-- based on event_date rather than creation date
INSERT INTO event_notifications (event_code, notification_type, scheduled_for, sent_at, is_completed)
SELECT 
  e.event_code,
  'system_maintenance' as notification_type,
  NOW() as scheduled_for,
  NOW() as sent_at,
  true as is_completed
FROM events e
WHERE e.event_date IS NOT NULL
LIMIT 1;
