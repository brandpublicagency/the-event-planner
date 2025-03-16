
import React, { createContext, useContext, useState, useCallback } from "react";
import { useTaskContext } from "./TaskContext";
import { Notification, NotificationContextType } from "@/types/notification";
import { useEventNotifications } from "@/hooks/notifications/useEventNotifications";
import { useTaskNotifications } from "@/hooks/notifications/useTaskNotifications";
import { useEventStatusNotifications } from "@/hooks/notifications/useEventStatusNotifications";
import { useNotificationActions } from "@/hooks/notifications/useNotificationActions";

// Re-export types from the types file
export type { NotificationType, Notification } from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tasks } = useTaskContext();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Use the specialized notification hooks
  useTaskNotifications(setNotifications, tasks);
  useEventNotifications(setNotifications);
  useEventStatusNotifications(setNotifications);
  
  // Use the combined notification actions hook
  const { markAsRead, markAllAsRead, clearNotifications, markAsCompleted } = 
    useNotificationActions(setNotifications);
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        markAsRead, 
        markAllAsRead,
        clearNotifications,
        markAsCompleted
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
