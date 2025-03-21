
import { Notification } from "@/types/notification";

/**
 * Creates a simple error notification for development/testing
 */
export const createErrorNotification = (error: any): Notification => {
  return {
    id: 'error-notification',
    title: 'System Error',
    description: error instanceof Error ? error.message : 'An unknown error occurred',
    createdAt: new Date(),
    read: false,
    type: 'system_error',
    status: 'sent'
  };
};

/**
 * Generates mock notifications for testing
 */
export const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: 'mock-notification-1',
      title: 'New event created',
      description: 'A new wedding event has been created',
      createdAt: new Date(),
      read: false,
      type: 'event_created',
      relatedId: 'event_123',
      actionType: 'review',
      status: 'sent'
    },
    {
      id: 'mock-notification-2',
      title: 'Task assigned',
      description: 'You have been assigned a new task',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      type: 'task_assigned',
      relatedId: 'task_456',
      actionType: 'complete',
      status: 'read'
    },
    {
      id: 'mock-notification-3',
      title: 'Document updated',
      description: 'The contract document has been updated',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      read: false,
      type: 'document_updated',
      relatedId: 'doc_789',
      actionType: 'review',
      status: 'sent'
    }
  ];
};
