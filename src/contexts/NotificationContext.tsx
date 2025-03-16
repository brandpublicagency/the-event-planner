
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";
import { useToast } from "@/hooks/use-toast";

// Create the context
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
    refreshNotifications: handleRefreshNotifications,
  } = useNotificationSystem();
  
  const { toast } = useToast();
  
  // Calculate unread count based on the actual notifications array
  const unreadCount = pendingNotifications.filter(n => !n.read).length;
  
  console.log('NotificationContext rendering with notifications:', pendingNotifications.length, 'unread:', unreadCount);
  
  // Wrapper for markAsRead that returns a void promise to match the expected type
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    try {
      await handleMarkAsRead(id);
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  }, [handleMarkAsRead, toast]);
  
  // Wrapper for markAsCompleted that returns a void promise to match the expected type
  const markAsCompleted = useCallback(async (id: string): Promise<void> => {
    try {
      await handleMarkAsCompleted(id);
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as completed',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  }, [handleMarkAsCompleted, toast]);
  
  // Wrapper for refreshNotifications that returns a void promise to match the expected type
  const refreshNotifications = useCallback(async (): Promise<void> => {
    try {
      await handleRefreshNotifications();
      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      return Promise.reject(error);
    }
  }, [handleRefreshNotifications]);
  
  // Add markAllAsRead functionality
  const markAllAsRead = useCallback(() => {
    pendingNotifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id).catch(err => {
          console.error('Error marking notification as read:', err);
        });
      }
    });
  }, [pendingNotifications, markAsRead]);
  
  // Add clearNotifications functionality
  const clearNotifications = useCallback(() => {
    console.log('Clearing all notifications - marking as completed');
    pendingNotifications.forEach(notification => {
      markAsCompleted(notification.id).catch(err => {
        console.error('Error clearing notification:', err);
      });
    });
  }, [pendingNotifications, markAsCompleted]);

  useEffect(() => {
    // Refresh notifications when component mounts
    refreshNotifications().catch(err => {
      console.error('Failed to refresh notifications on mount:', err);
    });
    
    // Set up a periodic refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('Periodic notification refresh');
      refreshNotifications().catch(err => {
        console.error('Failed to refresh notifications on interval:', err);
      });
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [refreshNotifications]);

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
