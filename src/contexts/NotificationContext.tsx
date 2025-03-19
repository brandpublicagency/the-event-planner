
import React, { createContext, useContext } from "react";
import { NotificationContextType } from "@/types/notification";
import { useNotificationContextState } from "@/hooks/notifications/useNotificationContextState";
import { useNotificationBatchActions } from "@/hooks/notifications/useNotificationBatchActions";
import { useNotificationSetup } from "@/hooks/notifications/useNotificationSetup";

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Get state and basic actions
  const {
    pendingNotifications,
    loading,
    error,
    unreadCount,
    isSubscribed,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    toast,
    refreshIntervalRef,
    isMounted
  } = useNotificationContextState();
  
  // Get batch actions
  const {
    markAllAsRead,
    clearNotifications
  } = useNotificationBatchActions(pendingNotifications, markAsRead, markAsCompleted, toast);
  
  // Set up notifications and handle errors
  useNotificationSetup(
    error,
    isSubscribed,
    refreshNotifications,
    isMounted,
    refreshIntervalRef,
    toast
  );
  
  console.log('NotificationContext rendering with notifications:', pendingNotifications.length, 'unread:', unreadCount);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications: pendingNotifications, 
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

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
