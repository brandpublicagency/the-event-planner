
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
  const { markAsRead: markAsReadAction, markAllAsRead, clearNotifications, markAsCompleted: markAsCompletedAction } = 
    useNotificationActions(setNotifications);
  
  // Create wrapper functions that return void promises to match the expected types
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    await markAsReadAction(id);
    return Promise.resolve();
  }, [markAsReadAction]);
  
  const markAsCompleted = useCallback(async (id: string): Promise<void> => {
    await markAsCompletedAction(id);
    return Promise.resolve();
  }, [markAsCompletedAction]);

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
