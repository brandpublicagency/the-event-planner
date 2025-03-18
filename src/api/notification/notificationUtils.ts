import { Notification } from "@/types/notification";
import { supabase } from "@/integrations/supabase/client";

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
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

/**
 * Check if a notification exists for a specific event
 */
export const notificationExistsForEvent = async (
  eventCode: string,
  notificationType: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('event_notifications')
      .select('id')
      .eq('event_code', eventCode)
      .eq('notification_type', notificationType)
      .limit(1);
      
    if (error) throw error;
    return !!data && data.length > 0;
  } catch (err) {
    console.error('Error checking notification existence:', err);
    return false;
  }
};

/**
 * Create fallback notifications for recent events
 */
export const createFallbackNotifications = async (recentEvents: any[]): Promise<Notification[]> => {
  console.log('Creating fallback notifications for recent events');
  const fallbackNotifications: Notification[] = [];
  
  for (const event of recentEvents) {
    // Create a virtual event_created notification
    fallbackNotifications.push({
      id: `fallback_${event.event_code}_created`,
      title: 'New Event',
      description: `Event "${event.name}" has been created`,
      createdAt: new Date(event.created_at),
      type: 'event_created_unified',
      read: false,
      actionType: 'review',
      relatedId: event.event_code,
      status: 'sent'
    });
    
    // If the event has an event_date in the future
    if (event.event_date && new Date(event.event_date) > new Date()) {
      const eventDate = new Date(event.event_date);
      const now = new Date();
      
      // Add document_due_reminder if event is less than 14 days away
      const daysTillEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysTillEvent <= 14) {
        fallbackNotifications.push({
          id: `fallback_${event.event_code}_document`,
          title: 'Document Due',
          description: `Documents are due soon for "${event.name}"`,
          createdAt: now,
          type: 'document_due_reminder',
          read: false,
          actionType: 'review',
          relatedId: event.event_code,
          status: 'sent'
        });
      }
      
      // Add payment_reminder if event is less than 7 days away
      if (daysTillEvent <= 7) {
        fallbackNotifications.push({
          id: `fallback_${event.event_code}_payment`,
          title: 'Payment Reminder',
          description: `Payment is due soon for "${event.name}"`,
          createdAt: now,
          type: 'payment_reminder',
          read: false,
          actionType: 'review',
          relatedId: event.event_code,
          status: 'sent'
        });
      }
    }
  }
  
  return fallbackNotifications;
};
