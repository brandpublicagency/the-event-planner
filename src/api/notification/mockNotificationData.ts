
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/types/notification';

/**
 * Generates mock notifications for testing and development
 */
export const generateMockNotifications = (): Notification[] => {
  return [
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
    },
    {
      id: uuidv4(),
      title: 'Payment Reminder',
      description: 'Final payment is due in 7 days',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      read: false,
      type: 'payment_reminder',
      relatedId: `event_${uuidv4()}`,
      actionType: 'review'
    }
  ];
};

/**
 * Simulates an error in notification loading
 */
export const createErrorNotification = (error: any): Notification => {
  return {
    id: `error-${Date.now()}`,
    title: 'Error Loading Notifications',
    description: error instanceof Error ? error.message : 'Unknown error loading notifications',
    createdAt: new Date(),
    type: 'event_created_unified',
    read: false,
    actionType: 'review',
    status: 'sent'
  };
};
