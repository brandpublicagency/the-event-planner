
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { format } from "date-fns";
import { formatNotificationTitle } from "./notificationUtils";

/**
 * Format notification data with templates
 * Simplified to remove scheduled status and only show read/unread/completed
 */
export const formatNotifications = async (notificationsData: any[]): Promise<Notification[]> => {
  try {
    // Validate input data
    if (!notificationsData || !Array.isArray(notificationsData)) {
      console.error('Invalid notification data format:', notificationsData);
      return [];
    }

    // Get notification templates for formatting
    const { data: templatesData, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*');

    if (templatesError) {
      console.error('Error fetching notification templates:', templatesError);
      throw new Error(templatesError.message);
    }

    if (!templatesData || templatesData.length === 0) {
      console.log('No notification templates found in database');
      
      // Return basic notifications without template data
      return notificationsData.map(item => {
        // Data validation for each notification
        const notificationType = item?.notification_type || 'unknown';
        const eventName = item?.events?.name || 'Untitled Event';
        const createdDate = item?.sent_at || item?.created_at || new Date().toISOString();
        
        // Ensure status is one of the allowed values
        const status: "completed" | "read" | "sent" = 
          item?.is_completed ? 'completed' : 
          item?.is_read ? 'read' : 
          'sent';
        
        return {
          id: item?.id || `generated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: formatNotificationTitle(notificationType) || 'Notification',
          description: `${notificationType} for ${eventName}`,
          createdAt: new Date(createdDate),
          type: notificationType as any,
          read: Boolean(item?.is_read),
          actionType: 'review' as any,
          relatedId: item?.event_code,
          status: status
        };
      });
    }

    // Create a map of templates for easy lookup
    const templatesMap = templatesData.reduce((acc, template) => {
      if (template?.type) {
        acc[template.type] = template;
      }
      return acc;
    }, {} as Record<string, any>);

    // Transform data to match Notification type
    return notificationsData.map(item => {
      // Skip invalid entries
      if (!item || typeof item !== 'object') {
        console.warn('Skipping invalid notification item:', item);
        return null;
      }
      
      // Find matching template
      const template = item?.notification_type ? templatesMap[item.notification_type] : null;
      
      // Default values for safety
      const notificationType = item?.notification_type || 'unknown';
      const eventName = item?.events?.name || 'Untitled Event';
      const eventType = item?.events?.event_type || 'Event';
      const primaryContact = item?.events?.primary_name || 'Client';
      const createdDate = item?.sent_at || item?.created_at || new Date().toISOString();
      const eventDate = item?.events?.event_date;
      
      // Process template with event data
      let description = template?.description_template || 'Notification';
      let title = template?.title || formatNotificationTitle(notificationType) || 'Notification';
      
      // Replace template placeholders safely
      try {
        description = description.replace(/{event_name}/g, eventName);
        description = description.replace(/{event_type}/g, eventType);
        description = description.replace(/{primary_contact}/g, primaryContact);
        
        // Format and replace event_date if it exists
        if (eventDate && description.includes('{event_date}')) {
          try {
            const formattedDate = format(new Date(eventDate), 'dd MMMM yyyy');
            description = description.replace(/{event_date}/g, formattedDate);
          } catch (dateError) {
            console.error('Error formatting date:', dateError, eventDate);
            description = description.replace(/{event_date}/g, eventDate || 'upcoming date');
          }
        } else {
          description = description.replace(/{event_date}/g, 'upcoming date');
        }
      } catch (e) {
        console.error('Error processing notification template:', e);
        // Provide a default description if template processing fails
        description = `Notification for ${eventName}`;
      }

      // Ensure status is one of the allowed values
      const status: "completed" | "read" | "sent" = 
        item?.is_completed ? 'completed' : 
        item?.is_read ? 'read' : 
        'sent';

      // Create the notification object with safe values
      return {
        id: item?.id || `generated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: title,
        description: description,
        createdAt: new Date(createdDate),
        type: notificationType as any,
        read: Boolean(item?.is_read),
        actionType: template?.action_type as any || 'review',
        relatedId: item?.event_code,
        status: status
      };
    }).filter(Boolean) as Notification[]; // Filter out null entries
  } catch (error) {
    console.error('Error formatting notifications:', error);
    // Provide a basic format if there's an error, with error notification
    const errorNotification: Notification = {
      id: `error-${Date.now()}`,
      title: 'Error Formatting Notifications',
      description: error instanceof Error ? error.message : 'Unknown error formatting notifications',
      createdAt: new Date(),
      type: 'event_created_unified' as any,
      read: false,
      actionType: 'review' as any,
      status: 'sent'
    };
    
    // Also try to format what we can from the original data
    const basicNotifications = notificationsData
      .filter(item => item && typeof item === 'object')
      .map(item => {
        // Ensure status is one of the allowed values
        const status: "completed" | "read" | "sent" = 
          item.is_completed ? 'completed' : 
          item.is_read ? 'read' : 
          'sent';
        
        return {
          id: item.id || `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: formatNotificationTitle(item.notification_type) || 'Notification',
          description: `Notification for ${item.events?.name || 'Event'}`,
          createdAt: new Date(item.sent_at || item.created_at || Date.now()),
          type: item.notification_type as any,
          read: Boolean(item.is_read),
          actionType: 'review' as any,
          relatedId: item.event_code,
          status: status
        };
      });
    
    return [errorNotification, ...basicNotifications];
  }
};
