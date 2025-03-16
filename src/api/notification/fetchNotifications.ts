
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { triggerNotificationProcessing } from "./triggerNotificationProcessing";
import { formatNotifications } from "./formatNotifications";
import { removeDuplicateNotifications } from "./notificationUtils";

/**
 * Fetches notification data from Supabase and formats it for display
 * This is the SINGLE SOURCE OF TRUTH for notifications
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  try {
    console.log('Fetching notifications data from API...');
    
    // Query event notifications with updated filtering to include pending notifications
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
        events:events!inner(name, event_type, primary_name, event_date)
      `)
      .not('is_completed', 'eq', true)  // Exclude completed notifications
      .order('scheduled_for', { ascending: false })
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
          events:events!inner(name, event_type, primary_name, event_date)
        `)
        .not('is_completed', 'eq', true)  // Exclude completed notifications
        .order('scheduled_for', { ascending: false })
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
