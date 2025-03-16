import { Notification } from "@/types/notification";

/**
 * Format the notification title based on notification type
 */
export const formatNotificationTitle = (type: string): string => {
  switch (type) {
    case 'event_created':
      return 'New Event Created';
    case 'event_created_unified':
      return 'New Event Added';
    case 'task_overdue':
      return 'Task Overdue';
    case 'task_upcoming':
      return 'Upcoming Task';
    case 'event_incomplete':
      return 'Event Incomplete';
    case 'final_payment_reminder':
      return 'Final Payment Due';
    case 'document_due_reminder':
      return 'Documents Required';
    case 'task_created':
      return 'New Task Created';
    default:
      return 'Notification';
  }
};

/**
 * Remove duplicate notifications keeping only the most recent
 */
export const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  const uniqueMap = new Map<string, Notification>();
  
  // Sort by createdAt (newest first) before deduplication to ensure we keep the most recent
  const sortedNotifications = [...notifications].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  // For each notification, create a unique key by event code and type
  for (const notification of sortedNotifications) {
    const key = `${notification.relatedId}_${notification.type}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, notification);
    }
  }
  
  return Array.from(uniqueMap.values());
};

/**
 * Determine toast variant based on notification type
 */
export const getToastVariantFromNotificationType = (type: string): "default" | "destructive" | "success" | "info" => {
  if (type.includes('error') || type.includes('overdue') || type.includes('incomplete')) {
    return "destructive";
  } else if (type.includes('created') || type.includes('completed')) {
    return "success";
  } else if (type.includes('reminder') || type.includes('upcoming')) {
    return "info";
  } else {
    return "default";
  }
};

/**
 * Creates fallback notifications for recent events when edge functions fail
 */
export const createFallbackNotifications = async (events: any[]): Promise<Notification[]> => {
  if (!events || events.length === 0) return [];
  
  console.log('Creating fallback notifications for', events.length, 'events');
  
  return events.map(event => ({
    id: `fallback-${event.event_code}-${Date.now()}`,
    title: 'New Event Added',
    description: `${event.name} (${event.event_type}) has been created.`,
    createdAt: new Date(event.created_at),
    type: 'event_created_unified',
    read: false,
    actionType: 'review',
    relatedId: event.event_code,
    status: 'sent'
  }));
};

/**
 * Checks if a notification already exists for an event
 */
export const notificationExistsForEvent = (notifications: Notification[], eventCode: string): boolean => {
  return notifications.some(notification => notification.relatedId === eventCode);
};
