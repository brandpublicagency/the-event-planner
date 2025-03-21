
import { Notification } from "@/types/notification";
import { v4 as uuidv4 } from 'uuid';
import { formatNotificationTitle } from "./notificationUtils";

/**
 * Format notification data with templates
 * MOCK VERSION - doesn't query the database
 */
export const formatNotifications = async (notificationsData: any[]): Promise<Notification[]> => {
  try {
    // Validate input data
    if (!notificationsData || !Array.isArray(notificationsData)) {
      console.error('Invalid notification data format:', notificationsData);
      return [];
    }
    
    // Transform data to match Notification type
    return notificationsData.map(item => {
      // Default values
      const notificationType = item?.notification_type || 'unknown';
      const eventName = item?.events?.name || 'Untitled Event';
      const createdDate = item?.sent_at || item?.created_at || new Date().toISOString();
      
      // Simple content formatting
      const description = `${notificationType} for ${eventName}`;
      const title = formatNotificationTitle(notificationType);
      
      // Ensure status is valid
      const status: "completed" | "read" | "sent" = 
        item?.is_completed ? 'completed' : 
        item?.is_read ? 'read' : 
        'sent';

      // Create notification
      return {
        id: item?.id || `generated-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: title,
        description: description,
        createdAt: new Date(createdDate),
        type: notificationType as any,
        read: Boolean(item?.is_read),
        actionType: 'review' as any,
        relatedId: item?.event_code,
        status: status
      };
    });
  } catch (error) {
    console.error('Error formatting notifications:', error);
    
    // Provide error notification
    return [{
      id: `error-${Date.now()}`,
      title: 'Error Formatting Notifications',
      description: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
      type: 'system_notice' as any,
      read: false,
      actionType: 'acknowledge' as any,
      status: 'sent'
    }];
  }
};
