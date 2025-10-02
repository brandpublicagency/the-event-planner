
export type NotificationType = "event_created" | string;

export type NotificationActionType = "review" | "complete" | "acknowledge" | string;

export type NotificationStatus = "completed" | "read" | "sent";

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  type: NotificationType;
  relatedId?: string;
  actionType?: NotificationActionType;
  status?: NotificationStatus;
}

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<boolean>;
  markAsCompleted: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  clearNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<boolean>;
  lastFilterRefresh?: number;
};

// Export all internal types
export type { NotificationContextType as NotificationContext };
export interface NotificationPreferences {
  toastDuration: number;
  enableSounds: boolean;
  enableGrouping: boolean;
  filterTypes: string[];
}

export interface NotificationFilter {
  type: 'all' | 'unread' | 'read';
  showCompleted?: boolean;
}
