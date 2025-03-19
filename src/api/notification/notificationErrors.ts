
import { Notification } from "@/types/notification";

/**
 * Creates an error notification to display to the user
 * @param error The error that occurred
 * @returns A notification object representing the error
 */
export const createErrorNotification = (error: unknown): Notification => {
  return {
    id: 'error-notification',
    title: 'Notification System Error',
    description: error instanceof Error ? error.message : 'Unable to load notifications',
    createdAt: new Date(),
    type: 'event_created_unified',
    read: false,
    status: 'sent'
  };
};

/**
 * Creates a set of fallback notifications from original data
 * Used to ensure UI doesn't break when there's a partial error
 */
export const createBasicNotifications = (notificationsData: any[]): Notification[] => {
  return notificationsData
    .filter(item => item && typeof item === 'object')
    .map(item => {
      // Ensure status is one of the allowed values
      const status: "completed" | "read" | "sent" = 
        item.is_completed ? 'completed' : 
        item.is_read ? 'read' : 
        'sent';
      
      return {
        id: item.id || `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: item.notification_type ? formatTitleFromType(item.notification_type) : 'Notification',
        description: `Notification for ${item.events?.name || 'Event'}`,
        createdAt: new Date(item.sent_at || item.created_at || Date.now()),
        type: item.notification_type as any,
        read: Boolean(item.is_read),
        actionType: 'review' as any,
        relatedId: item.event_code,
        status: status
      };
    });
};

/**
 * Simple utility to format title from notification type
 * Duplicated here to avoid circular dependencies
 */
const formatTitleFromType = (type: string): string => {
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
