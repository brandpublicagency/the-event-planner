
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

    // Get notification templates separately
    const { data: templatesData, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*');

    if (templatesError) {
      console.error('Error fetching notification templates:', templatesError);
      throw new Error(templatesError.message);
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
      description = description.replace('{event_name}', item.events.name || 'Untitled Event');
      description = description.replace('{event_type}', item.events.event_type || 'Event');
      description = description.replace('{primary_contact}', item.events.primary_name || 'Client');

      return {
        id: item.id,
        title: template?.title || 'Notification',
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
    throw err;
  }
};
