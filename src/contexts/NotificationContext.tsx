
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock API function for fetching notifications - optimized to limit the number of notifications
const fetchNotificationData = async (): Promise<Notification[]> => {
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
  
  return Promise.resolve(mockNotifications);
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Calculate unread count - memoized to prevent recalculation
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);
  
  // Fetch notifications on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotificationData();
        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadNotifications();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Optimized with useCallback to prevent recreating functions on each render
  // Mark a notification as read
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    return Promise.resolve();
  }, []);
  
  // Mark a notification as completed (remove it)
  const markAsCompleted = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    return Promise.resolve();
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast('All notifications marked as read');
  }, []);
  
  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    toast('All notifications cleared');
  }, []);
  
  // Refresh notifications
  const refreshNotifications = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchNotificationData();
      setNotifications(data);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setLoading(false);
    }
    return Promise.resolve();
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    notifications, 
    unreadCount,
    markAsRead, 
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    refreshNotifications
  }), [
    notifications, 
    unreadCount,
    markAsRead, 
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    refreshNotifications
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
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
