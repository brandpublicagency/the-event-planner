
import { Notification } from "@/types/notification";
import { formatTitleFromType } from "@/contexts/notification/notificationFormatters";

/**
 * Creates an error notification to display to the user
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
 */
export const createBasicNotifications = (notificationsData: any[]): Notification[] => {
  return notificationsData
    .filter(item => item && typeof item === 'object')
    .map(item => {
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
