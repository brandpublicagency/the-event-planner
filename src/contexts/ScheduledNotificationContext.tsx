
import React, { createContext, useContext } from "react";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";
import { Notification } from "@/types/notification";

interface ScheduledNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  triggerNotificationProcessing: () => Promise<any>;
  loading: boolean;
}

const ScheduledNotificationContext = createContext<ScheduledNotificationContextType | null>(null);

export const useScheduledNotifications = () => {
  const context = useContext(ScheduledNotificationContext);
  if (!context) {
    throw new Error("useScheduledNotifications must be used within a ScheduledNotificationProvider");
  }
  return context;
};

export const ScheduledNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Use the centralized notification system
  const {
    loading,
    pendingNotifications,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  } = useNotificationSystem();
  
  // Calculate unread count
  const unreadCount = pendingNotifications.filter(n => !n.read).length;
  
  console.log('ScheduledNotificationContext rendering with notifications:', pendingNotifications.length, 'unread:', unreadCount);

  // Wrap functions to ensure they return Promise<void>
  const handleMarkAsRead = async (id: string): Promise<void> => {
    await markAsRead(id);
  };

  const handleMarkAsCompleted = async (id: string): Promise<void> => {
    await markAsCompleted(id);
  };

  const handleRefreshNotifications = async (): Promise<void> => {
    await refreshNotifications();
  };

  const contextValue: ScheduledNotificationContextType = {
    notifications: pendingNotifications,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications: handleRefreshNotifications,
    triggerNotificationProcessing,
    loading
  };

  return (
    <ScheduledNotificationContext.Provider value={contextValue}>
      {children}
    </ScheduledNotificationContext.Provider>
  );
};
