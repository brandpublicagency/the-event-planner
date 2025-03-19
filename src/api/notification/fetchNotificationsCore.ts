
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { formatNotifications } from "./formatNotifications";
import { removeDuplicateNotifications } from "./notificationUtils";

/**
 * Fetches primary notification data from Supabase
 * Internal function used by fetchNotificationData
 */
export const fetchPrimaryNotifications = async (): Promise<Notification[]> => {
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
    .not('notification_type', 'eq', 'proforma_reminder') // Exclude proforma_reminder notifications
    .order('sent_at', { ascending: false })
    .limit(20);

  if (notificationsError) {
    console.error('Error fetching notifications:', notificationsError);
    // Specific error handling based on error type
    if (notificationsError.code === 'PGRST116') {
      throw new Error('Authentication error: Your session may have expired');
    } else if (notificationsError.code === '23505') {
      throw new Error('Database constraint error');
    } else if (notificationsError.code?.startsWith('PGRST')) {
      throw new Error('Database query error: ' + notificationsError.message);
    } else if (notificationsError.message?.includes('network')) {
      throw new Error('Network connection error: Please check your internet connection');
    } else {
      throw new Error(notificationsError.message || 'Error fetching notifications');
    }
  }

  console.log('Fetched raw notifications:', notificationsData?.length || 0);

  // Data validation - check if we received valid data
  if (!notificationsData || !Array.isArray(notificationsData)) {
    console.error('Invalid notification data format received');
    throw new Error('Invalid notification data format received');
  }

  // If we found notifications, format them and return
  if (notificationsData.length > 0) {
    const formattedNotifications = await formatNotifications(notificationsData);
    console.log('Formatted notifications:', formattedNotifications.length);
    
    // Deduplicate notifications
    const uniqueNotifications = removeDuplicateNotifications(formattedNotifications);
    console.log('After removing duplicates:', uniqueNotifications.length);
    
    return uniqueNotifications;
  }
  
  // Return empty array if no notifications found
  return [];
};
