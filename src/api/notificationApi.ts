import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

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
        .is('is_read', false)
        .order('sent_at', { ascending: false })
        .limit(10);
        
      if (retryError || !retryData || retryData.length === 0) {
        return [];
      }
      
      console.log('Fetched notifications after creating basic ones:', retryData);
      return formatNotifications(retryData);
    }

    return formatNotifications(notificationsData);
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
        title: item.notification_type || 'Notification',
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
      let title = template?.title || item.notification_type || 'Notification';
      
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
      title: item.notification_type || 'Notification',
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
 * Creates some basic notification records if none exist
 * This is a fallback for when the edge function fails
 */
const createBasicNotifications = async () => {
  try {
    // First, get some events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, primary_name')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (eventsError || !events || events.length === 0) {
      console.log('No events found to create notifications for');
      return;
    }
    
    console.log('Found events for notifications:', events);
    
    // Check if these events already have notifications
    const { data: existingNotifications, error: checkError } = await supabase
      .from('event_notifications')
      .select('event_code')
      .in('event_code', events.map(e => e.event_code));
      
    if (checkError) {
      console.error('Error checking existing notifications:', checkError);
      return;
    }
    
    const existingEventCodes = new Set(existingNotifications?.map(n => n.event_code) || []);
    
    // Create basic notifications for events that don't have them
    for (const event of events) {
      if (!existingEventCodes.has(event.event_code)) {
        const { error: insertError } = await supabase
          .from('event_notifications')
          .insert([
            {
              event_code: event.event_code,
              notification_type: 'event_created',
              scheduled_for: new Date().toISOString(),
              sent_at: new Date().toISOString(),
            }
          ]);
          
        if (insertError) {
          console.error('Error creating notification for event:', event.event_code, insertError);
        } else {
          console.log('Created notification for event:', event.event_code);
        }
      }
    }
  } catch (err) {
    console.error('Error creating basic notifications:', err);
  }
};
