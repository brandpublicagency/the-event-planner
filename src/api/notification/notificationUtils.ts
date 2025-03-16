
import { Notification } from "@/types/notification";

/**
 * Format notification titles from snake_case to proper titles
 */
export const formatNotificationTitle = (notificationType: string | null): string => {
  if (!notificationType) return 'Notification';
  
  // Handle specific notification types
  switch (notificationType) {
    case 'event_created':
      return 'New Event Created';
    case 'event_created_unified':
      return 'New Event Created';
    case 'proforma_reminder':
      return 'Pro-forma Invoice Reminder';
    case 'event_incomplete':
      return 'Event Document Reminder';
    case 'task_overdue':
      return 'Task Overdue';
    case 'task_upcoming':
      return 'Upcoming Task';
    case 'task_created':
      return 'New Task Created';
    case 'final_payment_reminder':
      return 'Final Payment Reminder';
    case 'document_due_reminder':
      return 'Document Due Reminder';
    default:
      // Format other types by converting snake_case to Title Case
      return notificationType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

/**
 * Removes duplicate notifications based on type and relatedId
 */
export const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  const seen = new Map();
  return notifications.filter(notification => {
    // Create a unique key using type and relatedId
    const key = `${notification.type}_${notification.relatedId}`;
    if (seen.has(key)) {
      console.log(`Filtering out duplicate notification: ${key}`);
      return false;
    }
    seen.set(key, true);
    return true;
  });
};
