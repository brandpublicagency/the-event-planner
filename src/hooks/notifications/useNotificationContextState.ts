
import { useState, useCallback, useEffect, useRef } from "react";
import { Notification } from "@/types/notification";
import { useNotificationSystem } from "@/hooks/notifications/useNotificationSystem";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeNotifications } from "@/hooks/notifications/useRealTimeNotifications";

export function useNotificationContextState() {
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
  
  // Calculate unread count based on the actual notifications array
  const unreadCount = pendingNotifications.filter(n => !n.read).length;

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

  return {
    pendingNotifications,
    loading,
    error,
    unreadCount,
    isSubscribed,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    toast,
    refreshIntervalRef,
    isMounted
  };
}
