
import { Notification } from "@/types/notification";
import { generateMockNotifications } from "./mockNotificationData";

/**
 * Fetches primary notification data
 * Internal function used by fetchNotificationData
 */
export const fetchPrimaryNotifications = async (): Promise<Notification[]> => {
  console.log('Fetching primary notifications...');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock notifications
  return generateMockNotifications();
};
