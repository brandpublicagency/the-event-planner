
// Basic notification types
export type NotificationType = 
  | "event_created" 
  | "task_reminder" 
  | "payment_reminder" 
  | "document_reminder"
  | "event_created_unified"
  | "task_overdue"
  | "task_upcoming"
  | "event_incomplete"
  | "final_payment_reminder"
  | "document_due_reminder"
  | "task_created"
  | string; // Add string to make it more flexible during the rebuild phase

export type NotificationActionType = 
  | "review"
  | "complete"
  | "acknowledge"
  | "approve"  // Add approve to fix the type error
  | string;    // Add string for flexibility

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  type: NotificationType;
  relatedId?: string;
  actionType?: NotificationActionType;
  status?: "completed" | "read" | "sent";
}

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;
};
