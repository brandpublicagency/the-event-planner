
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { triggerNotificationProcessing } from "./triggerNotificationProcessing";
import { formatNotifications } from "./formatNotifications";
import { removeDuplicateNotifications } from "./notificationUtils";

/**
 * Fetches notification data from Supabase and formats it for display
 * This is the SINGLE SOURCE OF TRUTH for notifications
 * Simplified to fetch only active notifications (not scheduled for future)
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  try {
    console.log('Fetching notifications data from API...');
    
    // Query event notifications with updated filtering to only include sent notifications
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('event_notifications')
      .select(`
        id,
        event_code,
        notification_type,
        sent_at,
        is_read,
        is_completed,
        created_at,
        events:events!inner(name, event_type, primary_name, event_date)
      `)
      .not('is_completed', 'eq', true)  // Exclude completed notifications
      .not('sent_at', 'is', null)       // Only include notifications that have been sent
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
      
      try {
        // Trigger notification processing to create any immediate notifications
        await triggerNotificationProcessing();
        
        // Try fetching again after creating notifications
        const { data: retryData, error: retryError } = await supabase
          .from('event_notifications')
          .select(`
            id,
            event_code,
            notification_type,
            sent_at,
            is_read,
            is_completed,
            created_at,
            events:events!inner(name, event_type, primary_name, event_date)
          `)
          .not('is_completed', 'eq', true)  // Exclude completed notifications
          .not('sent_at', 'is', null)       // Only include notifications that have been sent
          .order('sent_at', { ascending: false })
          .limit(20);
          
        if (retryError) {
          console.error('Error fetching notifications after processing:', retryError);
          return [];
        }
        
        if (retryData && retryData.length > 0) {
          console.log('Fetched notifications after processing:', retryData.length);
          const formattedRetryNotifications = await formatNotifications(retryData);
          return removeDuplicateNotifications(formattedRetryNotifications);
        }
      } catch (processingError) {
        console.error('Error during notification processing:', processingError);
      }
      
      console.log('Still no notifications after retry');
      return [];
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
