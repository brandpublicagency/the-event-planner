
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useTaskContext } from "./TaskContext";
import { Notification, NotificationContextType } from "@/types/notification";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";

// Re-export types from the types file
export type { NotificationType, Notification } from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use the centralized notification system hook
  const {
    pendingNotifications,
    loading,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications,
  } = useNotificationSystem();
  
  // Calculate unread count based on the actual notifications array
  const unreadCount = pendingNotifications.filter(n => !n.read).length;
  
  console.log('NotificationContext rendering with notifications:', pendingNotifications.length, 'unread:', unreadCount);
  
  // Create wrapper functions that return void promises to match the expected types
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    await handleMarkAsRead(id);
    return Promise.resolve();
  }, [handleMarkAsRead]);
  
  const markAsCompleted = useCallback(async (id: string): Promise<void> => {
    await handleMarkAsCompleted(id);
    return Promise.resolve();
  }, [handleMarkAsCompleted]);
  
  // Add markAllAsRead and clearNotifications functions
  const markAllAsRead = useCallback(() => {
    pendingNotifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id).catch(err => {
          console.error('Error marking notification as read:', err);
        });
      }
    });
  }, [pendingNotifications, markAsRead]);
  
  const clearNotifications = useCallback(() => {
    // This doesn't actually remove notifications from database
    // Just a placeholder for the interface compatibility
    console.log('clearNotifications called - this is a no-op in the current implementation');
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications: pendingNotifications, 
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
