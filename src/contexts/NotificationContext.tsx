
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeNotifications } from "@/hooks/notifications/useRealTimeNotifications";

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
  
  // Set up real-time notifications
  const { isSubscribed } = useRealTimeNotifications();
  
  const { toast } = useToast();
  const refreshIntervalRef = useRef<number | null>(null);
  const isMounted = useRef(true);
  
  // Display error toast if there's an error from the notification system
  useEffect(() => {
    if (error && isMounted.current) {
      toast({
        title: 'Notification System Error',
        description: error.message || 'Failed to load notifications',
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Warn user if real-time updates aren't available
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isSubscribed && isMounted.current) {
        console.warn('Real-time notifications are not available');
        toast({
          title: 'Notification Warning',
          description: 'Real-time updates may not be available. Refresh to see new notifications.',
          variant: 'info', // Changed from 'warning' to 'info' to match allowed variants
          duration: 10000,
        });
      }
    }, 15000); // Check after 15 seconds
    
    return () => clearTimeout(timeoutId);
  }, [isSubscribed, toast]);
  
  // Calculate unread count based on the actual notifications array
  const unreadCount = pendingNotifications.filter(n => !n.read).length;
  
  console.log('NotificationContext rendering with notifications:', pendingNotifications.length, 'unread:', unreadCount);
  
  // Wrapper for markAsRead that returns a void promise to match the expected type
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    if (!isMounted.current) return Promise.resolve();
    
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
    if (!isMounted.current) return Promise.resolve();
    
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
    if (!isMounted.current) return Promise.resolve();
    
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
    if (!isMounted.current) return;
    
    const unreadNotifications = pendingNotifications.filter(notification => !notification.read);
    if (unreadNotifications.length === 0) {
      toast({
        title: 'No unread notifications',
        variant: 'info',
      });
      return;
    }
    
    const promises = unreadNotifications.map(notification => markAsRead(notification.id));
    
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
    if (!isMounted.current) return;
    
    if (pendingNotifications.length === 0) {
      toast({
        title: 'No notifications to clear',
        variant: 'info',
      });
      return;
    }
    
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
    isMounted.current = true;
    
    // Refresh notifications when component mounts
    refreshNotifications().catch(err => {
      if (isMounted.current) {
        console.error('Failed to refresh notifications on mount:', err);
      }
    });
    
    // Set up a periodic refresh every 5 minutes
    refreshIntervalRef.current = window.setInterval(() => {
      if (isMounted.current) {
        console.log('Periodic notification refresh');
        refreshNotifications().catch(err => {
          if (isMounted.current) {
            console.error('Failed to refresh notifications on interval:', err);
          }
        });
      }
    }, 300000); // 5 minutes
    
    // Clean up the interval on unmount
    return () => {
      isMounted.current = false;
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
