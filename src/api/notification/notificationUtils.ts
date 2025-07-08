import { Notification } from "@/types/notification";

/**
 * Remove duplicate notifications keeping only the most recent for each type
 */
export const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  const unique = new Map<string, Notification>();
  
  // Sort by creation date descending to ensure we keep the most recent
  const sorted = [...notifications].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  // Only keep the most recent notification for each type per event
  for (const notification of sorted) {
    const key = `${notification.relatedId}_${notification.type}`;
    if (!unique.has(key)) {
      unique.set(key, notification);
    }
  }
  
  return Array.from(unique.values());
};

/**
 * Format notification title from type
 */
export const formatNotificationTitle = (type: string): string => {
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
    case 'system_notice':
      return 'System Notice';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

/**
 * Check if a notification exists - MOCK implementation
 */
export const notificationExistsForEvent = async (
  eventCode: string,
  notificationType: string
): Promise<boolean> => {
  
  // Always return false for mock implementation
  return false;
};

/**
 * Create fallback notifications for recent events - MOCK implementation
 */
export const createFallbackNotifications = async (recentEvents: any[]): Promise<Notification[]> => {
  const fallbackNotifications: Notification[] = [];
  
  for (const event of recentEvents) {
    // Create a virtual event_created notification
    fallbackNotifications.push({
      id: `fallback_${event.event_code || 'unknown'}_created`,
      title: 'New Event',
      description: `Event "${event.name || 'Unnamed'}" has been created`,
      createdAt: new Date(event.created_at || Date.now()),
      type: 'event_created_unified',
      read: false,
      actionType: 'review',
      relatedId: event.event_code || 'unknown',
      status: 'sent'
    });
  }
  
  return fallbackNotifications;
};
