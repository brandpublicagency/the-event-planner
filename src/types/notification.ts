
export type NotificationType = 
  | "event_created" 
  | "event_created_unified"  
  | "task_overdue" 
  | "task_upcoming" 
  | "event_incomplete"
  | "final_payment_reminder"  
  | "document_due_reminder"   
  | "task_created"
  | "payment_reminder";

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  type: NotificationType;
  read: boolean;
  actionType?: "review" | "approve";
  relatedId?: string; // event_code or task_id
  status?: "sent" | "read" | "completed";
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  markAsCompleted?: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}
