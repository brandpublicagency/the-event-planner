
import React, { createContext, useContext, useState } from "react";
import { useTaskContext } from "./TaskContext";
import { useToast } from "@/hooks/use-toast";
import { Notification, NotificationContextType } from "@/types/notification";
import { useEventNotifications } from "@/hooks/notifications/useEventNotifications";
import { useTaskNotifications } from "@/hooks/notifications/useTaskNotifications";
import { useEventStatusNotifications } from "@/hooks/notifications/useEventStatusNotifications";

// Re-export types from the types file
export type { NotificationType, Notification } from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tasks } = useTaskContext();
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Use the extracted hooks
  useTaskNotifications(setNotifications, tasks);
  useEventNotifications(setNotifications);
  useEventStatusNotifications(setNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        markAsRead, 
        markAllAsRead,
        clearNotifications
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
