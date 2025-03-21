
export type NotificationType = "event_created" | string;

export type NotificationActionType = "review" | "complete" | "acknowledge" | string;

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
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
};
