
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";
import { useRealTimeNotifications } from "@/hooks/notifications/useRealTimeNotifications";
import { Notification } from "@/types/notification";

interface ScheduledNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsCompleted: (id: string) => void;
  refreshNotifications: () => void;
  triggerNotificationProcessing: () => void;
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
  const {
    loading,
    pendingNotifications,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  } = useNotificationSystem();

  // Set up real-time notification subscription
  useRealTimeNotifications();
  
  // Calculate unread count
  const unreadCount = pendingNotifications.filter(n => !n.read).length;

  const contextValue: ScheduledNotificationContextType = {
    notifications: pendingNotifications,
    unreadCount,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    loading
  };

  return (
    <ScheduledNotificationContext.Provider value={contextValue}>
      {children}
    </ScheduledNotificationContext.Provider>
  );
};
