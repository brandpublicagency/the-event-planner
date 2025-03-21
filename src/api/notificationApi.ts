
import { Notification } from "@/types/notification";
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch notifications - returns mock data since we're rebuilding the system
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  console.log('Fetching mock notifications data');
  
  // Generate some mock notifications
  const mockNotifications: Notification[] = [
    {
      id: uuidv4(),
      title: 'Task Created',
      description: 'New task has been created for you',
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
      type: 'task_created',
      relatedId: `task_${uuidv4()}`,
      actionType: 'review'
    },
    {
      id: uuidv4(),
      title: 'Event Created',
      description: 'New wedding event has been scheduled',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      type: 'event_created',
      relatedId: `event_${uuidv4()}`,
      actionType: 'review'
    },
    {
      id: uuidv4(),
      title: 'Document Reminder',
      description: 'You have documents due soon',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      type: 'document_reminder',
      relatedId: `event_${uuidv4()}`,
      actionType: 'review'
    }
  ];
  
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
