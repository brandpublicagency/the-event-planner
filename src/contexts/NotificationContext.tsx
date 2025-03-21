
import React, { createContext, useContext, useMemo } from "react";
import { NotificationContextType } from "@/types/notification";
import { useNotificationContextState } from "@/hooks/notifications/useNotificationContextState";
import { useNotificationBatchActions } from "@/hooks/notifications/useNotificationBatchActions";

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use our extracted state hook
  const state = useNotificationContextState();
  
  // Use our batch actions hook
  const {
    markAllAsRead,
    clearNotifications
  } = useNotificationBatchActions(
    state.pendingNotifications,
    state.markAsRead,
    state.markAsCompleted,
    state.toast
  );

  // Clean up resources on unmount
  React.useEffect(() => {
    return () => {
      state.isMounted.current = false;
      if (state.refreshIntervalRef.current) {
        clearInterval(state.refreshIntervalRef.current);
      }
    };
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    notifications: state.pendingNotifications, 
    unreadCount: state.unreadCount,
    markAsRead: state.markAsRead, 
    markAsCompleted: state.markAsCompleted,
    markAllAsRead,
    clearNotifications,
    refreshNotifications: state.refreshNotifications
  }), [
    state.pendingNotifications, 
    state.unreadCount,
    state.markAsRead,
    state.markAsCompleted,
    state.refreshNotifications,
    markAllAsRead,
    clearNotifications
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
