
import React, { createContext, useContext, useState } from "react";
import { toast } from "@/hooks/use-toast";

// Basic notification type
export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  type: string;
  relatedId?: string;
  actionType?: string;
  status?: "completed" | "read" | "sent";
};

// Context type
type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;
};

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use simple state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mark a notification as read
  const markAsRead = async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    return Promise.resolve();
  };
  
  // Mark a notification as completed (remove it)
  const markAsCompleted = async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    return Promise.resolve();
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: 'All notifications marked as read',
      variant: 'success',
    });
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    toast({
      title: 'All notifications cleared',
      variant: 'success',
    });
  };
  
  // Refresh notifications (placeholder for future implementation)
  const refreshNotifications = async (): Promise<void> => {
    // This will be implemented later
    console.log('Refreshing notifications...');
    return Promise.resolve();
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        markAsRead, 
        markAsCompleted,
        markAllAsRead,
        clearNotifications,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
