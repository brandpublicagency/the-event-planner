
import { Notification } from "@/types/notification";

/**
 * Helper to format notification from database to our type
 */
export const formatNotification = (data: any): Notification => {
  // Ensure read status is a boolean
  const read = data.read === true || data.read === 'true' || data.read === 1;
  
  return {
    id: data.id,
    title: data.title || formatTitleFromType(data.notification_type),
    description: data.description || `Notification for ${data.event_name || 'event'}`,
    createdAt: new Date(data.created_at || new Date()),
    read: read,
    type: data.notification_type,
    relatedId: data.event_code,
    status: read ? "read" : "sent"
  };
};

/**
 * Helper to format title from notification type
 */
export const formatTitleFromType = (type: string): string => {
  switch (type) {
    case 'event_created':
      return 'New Event Created';
    case 'event_created_unified':
      return 'New Event';
    case 'task_overdue':
      return 'Task Overdue';
    case 'task_upcoming':
      return 'Upcoming Task';
    case 'event_incomplete':
      return 'Incomplete Event';
    case 'final_payment_reminder':
    case 'payment_reminder':
      return 'Payment Reminder';
    case 'document_due_reminder':
      return 'Document Due';
    case 'task_created':
      return 'New Task';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};
