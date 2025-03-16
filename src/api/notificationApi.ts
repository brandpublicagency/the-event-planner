
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";

/**
 * Fetches notification data from Supabase and formats it for display
 */
export const fetchNotificationData = async () => {
  try {
    // First, query event notifications
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('event_notifications')
      .select(`
        id,
        event_code,
        notification_type,
        scheduled_for,
        sent_at,
        is_read,
        is_completed,
        created_at,
        events:events!inner(name, event_type, primary_name)
      `)
      .is('is_read', false)
      .not('sent_at', 'is', null)
      .order('scheduled_for', { ascending: false });

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      throw new Error(notificationsError.message);
    }

    console.log('Fetched notifications:', notificationsData);

    // Check if notifications is empty or couldn't be loaded properly
    if (!notificationsData || notificationsData.length === 0) {
      console.log('No notifications found in database');
      return [];
    }

    // Get notification templates separately
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
        title: 'Notification',
        description: `${item.notification_type} for ${item.events?.name || 'Event'}`,
        createdAt: new Date(item.sent_at || item.created_at),
        type: item.notification_type as any,
        read: item.is_read,
        actionType: 'review' as any,
        relatedId: item.event_code
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
      let title = template?.title || 'Notification';
      
      // Safely replace template placeholders
      try {
        description = description.replace(/{event_name}/g, item.events?.name || 'Untitled Event');
        description = description.replace(/{event_type}/g, item.events?.event_type || 'Event');
        description = description.replace(/{primary_contact}/g, item.events?.primary_name || 'Client');
      } catch (e) {
        console.error('Error processing notification template:', e);
      }

      return {
        id: item.id,
        title: title,
        description: description,
        createdAt: new Date(item.sent_at || item.created_at),
        type: item.notification_type as any,
        read: item.is_read,
        actionType: template?.action_type as any || 'review',
        relatedId: item.event_code
      };
    });
  } catch (err) {
    console.error('Error in notification system:', err);
    // Instead of throwing, return an empty array to not break the UI
    return [];
  }
};
