
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

/**
 * Fetches notification data from Supabase and formats it for display
 * This is the SINGLE SOURCE OF TRUTH for notifications
 */
export const fetchNotificationData = async () => {
  try {
    console.log('Fetching notifications data from API...');
    
    // Query event notifications with proper filtering
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
      .not('is_completed', 'eq', true)  // Exclude completed notifications
      .filter('sent_at', 'not.is', null) // Only include sent notifications
      .order('sent_at', { ascending: false })
      .limit(20);

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      throw new Error(notificationsError.message);
    }

    console.log('Fetched raw notifications:', notificationsData?.length || 0);

    // Handle case when no notifications are found
    if (!notificationsData || notificationsData.length === 0) {
      console.log('No notifications found in database, triggering notification processing');
      
      // Trigger notification processing to create pending notifications
      await triggerNotificationProcessing();
      
      // Try fetching again after creating notifications
      const { data: retryData, error: retryError } = await supabase
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
        .not('is_completed', 'eq', true)  // Exclude completed notifications
        .filter('sent_at', 'not.is', null) // Only include sent notifications
        .order('sent_at', { ascending: false })
        .limit(20);
        
      if (retryError || !retryData || retryData.length === 0) {
        console.log('Still no notifications after retry');
        return [];
      }
      
      console.log('Fetched notifications after processing:', retryData.length);
      const formattedRetryNotifications = await formatNotifications(retryData);
      return removeDuplicateNotifications(formattedRetryNotifications);
    }

    const formattedNotifications = await formatNotifications(notificationsData);
    console.log('Formatted notifications:', formattedNotifications.length);
    
    // Deduplicate notifications
    const uniqueNotifications = removeDuplicateNotifications(formattedNotifications);
    console.log('After removing duplicates:', uniqueNotifications.length);
    
    return uniqueNotifications;
  } catch (err) {
    console.error('Error in notification system:', err);
    // Return an empty array to not break the UI
    return [];
  }
};

/**
 * Format notification data with templates
 */
const formatNotifications = async (notificationsData) => {
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
        createdAt: new Date(item.sent_at || item.created_at),
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
      createdAt: new Date(item.sent_at || item.created_at),
      type: item.notification_type as any,
      read: item.is_read,
      actionType: 'review' as any,
      relatedId: item.event_code,
      status: item.is_completed ? 'completed' : item.is_read ? 'read' : item.sent_at ? 'sent' : 'pending'
    }));
  }
}

/**
 * Format notification titles from snake_case to proper titles
 */
const formatNotificationTitle = (notificationType: string | null): string => {
  if (!notificationType) return 'Notification';
  
  // Handle specific notification types
  switch (notificationType) {
    case 'event_created':
      return 'New Event Created';
    case 'proforma_reminder':
      return 'Pro-forma Invoice Reminder';
    case 'event_incomplete':
      return 'Event Document Reminder';
    case 'task_overdue':
      return 'Task Overdue';
    case 'task_upcoming':
      return 'Upcoming Task';
    case 'task_created':
      return 'New Task Created';
    default:
      // Format other types by converting snake_case to Title Case
      return notificationType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

/**
 * Removes duplicate notifications based on type and relatedId
 */
const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  const seen = new Map();
  return notifications.filter(notification => {
    // Create a unique key using type and relatedId
    const key = `${notification.type}_${notification.relatedId}`;
    if (seen.has(key)) {
      console.log(`Filtering out duplicate notification: ${key}`);
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Trigger the notification processing edge function
 */
export const triggerNotificationProcessing = async () => {
  try {
    console.log('Triggering notification processing...');
    const { data, error } = await supabase.functions.invoke('process-notifications');
    
    if (error) {
      console.error('Error invoking process-notifications function:', error);
      throw error;
    }
    
    console.log('Notification processing response:', data);
    return data;
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    throw err;
  }
};
