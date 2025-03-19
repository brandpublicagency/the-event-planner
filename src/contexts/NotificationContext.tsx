
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
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
    error,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications: handleRefreshNotifications,
  } = useNotificationSystem();
  
  const { toast } = useToast();
  const refreshIntervalRef = useRef<number | null>(null);
  
  // Display error toast if there's an error from the notification system
  useEffect(() => {
    if (error) {
      toast({
        title: 'Notification System Error',
        description: error.message || 'Failed to load notifications',
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
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
  
  // Add markAllAsRead functionality that properly updates the database
  const markAllAsRead = useCallback(async () => {
    const promises = pendingNotifications
      .filter(notification => !notification.read)
      .map(notification => markAsRead(notification.id));
    
    try {
      await Promise.all(promises);
      toast({
        title: 'All notifications marked as read',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  }, [pendingNotifications, markAsRead, toast]);
  
  // Add clearNotifications functionality
  const clearNotifications = useCallback(async () => {
    const promises = pendingNotifications.map(notification => markAsCompleted(notification.id));
    
    try {
      await Promise.all(promises);
      toast({
        title: 'All notifications cleared',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear all notifications',
        variant: 'destructive',
      });
    }
  }, [pendingNotifications, markAsCompleted, toast]);

  // Set up periodic refresh and cleanup properly
  useEffect(() => {
    // Refresh notifications when component mounts
    refreshNotifications().catch(err => {
      console.error('Failed to refresh notifications on mount:', err);
    });
    
    // Set up a periodic refresh every 5 minutes
    refreshIntervalRef.current = window.setInterval(() => {
      console.log('Periodic notification refresh');
      refreshNotifications().catch(err => {
        console.error('Failed to refresh notifications on interval:', err);
      });
    }, 300000); // 5 minutes
    
    // Clean up the interval on unmount
    return () => {
      if (refreshIntervalRef.current !== null) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
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
