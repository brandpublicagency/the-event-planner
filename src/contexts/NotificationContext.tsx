
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { fetchNotificationData } from "@/api/notificationApi";
import { toast } from "sonner";

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotificationData();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
  }, []);
  
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
    toast('All notifications marked as read');
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    toast('All notifications cleared');
  };
  
  // Refresh notifications
  const refreshNotifications = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchNotificationData();
      setNotifications(data);
      toast('Notifications refreshed');
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setLoading(false);
    }
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
