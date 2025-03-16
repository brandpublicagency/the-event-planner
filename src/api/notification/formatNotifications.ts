
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { format } from "date-fns";
import { formatNotificationTitle } from "./notificationUtils";

/**
 * Format notification data with templates
 */
export const formatNotifications = async (notificationsData: any[]): Promise<Notification[]> => {
  try {
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
      return notificationsData.map(item => ({
        id: item.id,
        title: formatNotificationTitle(item.notification_type) || 'Notification',
        description: `${item.notification_type} for ${item.events?.name || 'Event'}`,
        createdAt: new Date(item.sent_at || item.scheduled_for || item.created_at),
        type: item.notification_type as any,
        read: item.is_read,
        actionType: 'review' as any,
        relatedId: item.event_code,
        status: item.is_completed ? 'completed' : item.is_read ? 'read' : item.sent_at ? 'sent' : 'pending'
      }));
    }

    // Create a map of templates for easy lookup
    const templatesMap = templatesData.reduce((acc, template) => {
      acc[template.type] = template;
      return acc;
    }, {});

    // Transform data to match Notification type
    return notificationsData.map(item => {
      // Find matching template
      const template = templatesMap[item.notification_type];
      
      // Process template with event data
      let description = template?.description_template || 'Notification';
      let title = template?.title || formatNotificationTitle(item.notification_type) || 'Notification';
      
      // Replace template placeholders safely
      try {
        description = description.replace(/{event_name}/g, item.events?.name || 'Untitled Event');
        description = description.replace(/{event_type}/g, item.events?.event_type || 'Event');
        description = description.replace(/{primary_contact}/g, item.events?.primary_name || 'Client');
        
        // Format and replace event_date if it exists
        if (item.events?.event_date && description.includes('{event_date}')) {
          try {
            const formattedDate = format(new Date(item.events.event_date), 'dd MMMM yyyy');
            description = description.replace(/{event_date}/g, formattedDate);
          } catch (dateError) {
            console.error('Error formatting date:', dateError, item.events.event_date);
            description = description.replace(/{event_date}/g, item.events.event_date || 'upcoming date');
          }
        } else {
          description = description.replace(/{event_date}/g, 'upcoming date');
        }
      } catch (e) {
        console.error('Error processing notification template:', e);
      }

      return {
        id: item.id,
        title: title,
        description: description,
        createdAt: new Date(item.sent_at || item.scheduled_for || item.created_at),
        type: item.notification_type as any,
        read: item.is_read,
        actionType: template?.action_type as any || 'review',
        relatedId: item.event_code,
        status: item.is_completed ? 'completed' : item.is_read ? 'read' : item.sent_at ? 'sent' : 'pending'
      };
    });
  } catch (error) {
    console.error('Error formatting notifications:', error);
    // Provide a basic format if there's an error
    return notificationsData.map(item => ({
      id: item.id,
      title: formatNotificationTitle(item.notification_type) || 'Notification',
      description: `Notification for ${item.events?.name || 'Event'}`,
      createdAt: new Date(item.sent_at || item.scheduled_for || item.created_at),
      type: item.notification_type as any,
      read: item.is_read,
      actionType: 'review' as any,
      relatedId: item.event_code,
      status: item.is_completed ? 'completed' : item.is_read ? 'read' : item.sent_at ? 'sent' : 'pending'
    }));
  }
};
