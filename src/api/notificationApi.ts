
import { Notification } from "@/types/notification";
import { v4 as uuidv4 } from 'uuid';
import { generateMockNotifications } from "./notification/mockNotificationData";

/**
 * Fetch notifications - returns mock data since we're rebuilding the system
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  console.log('Fetching mock notifications data');
  
  // Generate some mock notifications
  const mockNotifications = generateMockNotifications();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockNotifications;
};

/**
 * Format notification title
 */
export const formatNotificationTitle = (type: string): string => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Remove duplicate notifications - simplified version
 */
export const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  return notifications;
};

/**
 * Placeholder for formatting notifications
 */
export const formatNotifications = (notificationsData: any[]): Notification[] => {
  return notificationsData.map(item => ({
    id: item.id || uuidv4(),
    title: formatNotificationTitle(item.type),
    description: item.description || 'Notification description',
    createdAt: new Date(item.createdAt || Date.now()),
    read: Boolean(item.read),
    type: item.type,
    relatedId: item.relatedId,
    actionType: item.actionType || 'review',
    status: item.status || 'sent'
  }));
};

/**
 * Placeholder for future notification processing
 */
export const triggerNotificationProcessing = async (): Promise<any> => {
  console.log('Placeholder: triggerNotificationProcessing - will be implemented later');
  return { processed: 0, created: 0 };
};
