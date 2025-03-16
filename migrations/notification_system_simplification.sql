
-- Remove the scheduled_for column from event_notifications table
-- We're keeping it for now to avoid breaking changes, but we'll ignore it in code

-- Mark all currently scheduled notifications as completed
UPDATE event_notifications
SET is_completed = true
WHERE sent_at IS NULL;

-- Modify the notification trigger to disable auto-creation of future notifications
UPDATE notification_triggers
SET enabled = false
WHERE trigger_type IN ('days_before_event', 'days_after_creation');

-- Only keep the immediate notification trigger enabled
UPDATE notification_triggers
SET enabled = true
WHERE trigger_type = 'on_event_creation' 
AND template_type = 'event_created_unified';

-- Mark all future notifications as completed so they don't appear in UI
WITH future_notifications AS (
  SELECT n.id
  FROM event_notifications n
  JOIN events e ON n.event_code = e.event_code
  WHERE e.event_date IS NOT NULL
  AND n.notification_type IN ('document_due_reminder', 'final_payment_reminder')
  AND e.event_date > CURRENT_DATE + INTERVAL '14 days'
)
UPDATE event_notifications
SET is_completed = true
WHERE id IN (SELECT id FROM future_notifications);
