
import { Notification } from "@/types/notification";
import { generateMockNotifications, createErrorNotification } from "./mockNotificationData";

/**
 * Fetches notification data
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  try {
    console.log('Fetching notifications data from API...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock notifications
    return generateMockNotifications();
  } catch (err) {
    console.error('Error in notification system:', err);
    // Return a minimal set of notifications to prevent UI breakage
    return [createErrorNotification(err)];
  }
};
