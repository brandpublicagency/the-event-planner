
import React, { createContext, useContext, useEffect } from "react";
import { NotificationContextType } from "@/types/notification";
import { useNotificationStore } from "@/store/notificationStore";

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    fetchNotifications
  } = useNotificationStore();

  // Set up initial data fetch
  useEffect(() => {
    // Fetch notifications on initial load
    fetchNotifications().catch(err => {
      console.error('Error in initial notification fetch:', err);
    });
  }, [fetchNotifications]);

  // Create context value
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    refreshNotifications: fetchNotifications
  };

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
