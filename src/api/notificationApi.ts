
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

/**
 * Fetches notification data from Supabase and formats it for display
 */
export const fetchNotificationData = async () => {
  try {
    console.log('Fetching notifications data from API...');
    
    // Query event notifications - this is the SINGLE SOURCE OF TRUTH for notifications
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
      .is('sent_at', 'not.null')        // Only include sent notifications
      .order('sent_at', { ascending: false })
      .limit(20);

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      throw new Error(notificationsError.message);
    }

    console.log('Fetched raw notifications:', notificationsData?.length || 0);

    // Check if notifications is empty or couldn't be loaded properly
    if (!notificationsData || notificationsData.length === 0) {
      console.log('No notifications found in database, creating basic ones');
      
      // Create some basic notifications for testing
      await createBasicNotifications();
      
      // Try fetching again after creating basic ones
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
        .is('sent_at', 'not.null')        // Only include sent notifications
        .order('sent_at', { ascending: false })
        .limit(20);
        
      if (retryError || !retryData || retryData.length === 0) {
        console.log('Still no notifications after retry');
        return [];
      }
      
      console.log('Fetched notifications after creating basic ones:', retryData.length);
      return formatNotifications(retryData);
    }

    const formattedNotifications = await formatNotifications(notificationsData);
    console.log('Formatted notifications:', formattedNotifications.length);
    
    // De-duplicate notifications by filtering out ones with the same notification_type and event_code
    const uniqueNotifications = removeDuplicateNotifications(formattedNotifications);
    console.log('After removing duplicates:', uniqueNotifications.length);
    
    return uniqueNotifications;
  } catch (err) {
    console.error('Error in notification system:', err);
    // Instead of throwing, return an empty array to not break the UI
    return [];
  }
};

/**
 * Format notification data with templates if available
 */
const formatNotifications = async (notificationsData) => {
  try {
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
        title: formatNotificationTitle(item.notification_type) || 'Notification',
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
      let title = template?.title || formatNotificationTitle(item.notification_type) || 'Notification';
      
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
      relatedId: item.event_code
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
 * Removes duplicate notifications based on notification_type and event_code
 */
const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  const seen = new Set();
  return notifications.filter(notification => {
    // Create a unique key using type and relatedId
    const key = `${notification.type}_${notification.relatedId}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Creates some basic notification records if none exist
 * This is a fallback for when the edge function fails
 */
const createBasicNotifications = async () => {
  try {
    // Get the 5 most recent events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, primary_name')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (eventsError || !events || events.length === 0) {
      console.log('No events found to create notifications for');
      return;
    }
    
    console.log('Found events for notifications:', events.map(e => e.event_code).join(', '));
    
    // Check if these events already have notifications
    const { data: existingNotifications, error: checkError } = await supabase
      .from('event_notifications')
      .select('event_code, notification_type')
      .in('event_code', events.map(e => e.event_code));
      
    if (checkError) {
      console.error('Error checking existing notifications:', checkError);
      return;
    }
    
    // Create a map of existing notifications to avoid duplicates
    const existingMap = new Map();
    existingNotifications?.forEach(n => {
      const key = `${n.event_code}_${n.notification_type}`;
      existingMap.set(key, true);
    });
    
    // Create basic notifications for events that don't have them
    const notificationTypes = ['event_created', 'proforma_reminder', 'event_incomplete'];
    
    for (const event of events) {
      for (const notificationType of notificationTypes) {
        const key = `${event.event_code}_${notificationType}`;
        if (!existingMap.has(key)) {
          const currentTime = new Date().toISOString();
          
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert([
              {
                event_code: event.event_code,
                notification_type: notificationType,
                scheduled_for: currentTime,
                sent_at: currentTime, // Mark as sent immediately so it appears in the UI
                is_read: false
              }
            ]);
            
          if (insertError) {
            console.error('Error creating notification for event:', event.event_code, insertError);
          } else {
            console.log('Created notification for event:', event.event_code, notificationType);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error creating basic notifications:', err);
  }
};

