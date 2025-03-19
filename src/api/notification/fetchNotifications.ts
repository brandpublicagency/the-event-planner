
import { Notification } from "@/types/notification";
import { fetchPrimaryNotifications } from "./fetchNotificationsCore";
import { attemptFallbackNotifications } from "./fallbackNotifications";
import { createErrorNotification, createBasicNotifications } from "./notificationErrors";

/**
 * Fetches notification data from Supabase and formats it for display
 * This is the SINGLE SOURCE OF TRUTH for notifications
 * With enhanced fallback mechanisms for edge function failures
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  try {
    console.log('Fetching notifications data from API...');
    
    // First try the primary fetch method
    try {
      const notifications = await fetchPrimaryNotifications();
      
      // If we got notifications, return them
      if (notifications.length > 0) {
        return notifications;
      }
      
      // No notifications found, try to trigger notification processing
      console.log('No notifications found in database, trying fallback approaches');
    } catch (primaryError) {
      console.error('Primary notification fetch failed:', primaryError);
      // Continue to fallback methods
    }
    
    // If primary method failed or returned no results, try fallbacks
    return await attemptFallbackNotifications();
    
  } catch (err) {
    console.error('Error in notification system:', err);
    // Return a minimal set of notifications to prevent UI breakage
    // This is better than returning an empty array as it gives the user feedback
    return [createErrorNotification(err)];
  }
};
