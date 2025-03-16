
export type NotificationType = 
  | "event_created" 
  | "task_overdue" 
  | "task_upcoming" 
  | "event_incomplete"
  | "task_created";

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  type: NotificationType;
  read: boolean;
  actionType?: "review" | "approve";
  relatedId?: string; // event_code or task_id
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  markAsCompleted?: (id: string) => Promise<void>; // Added this optional method
}
