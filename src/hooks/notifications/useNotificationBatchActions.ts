
import { useCallback } from "react";
import { Notification } from "@/types/notification";

export function useNotificationBatchActions(
  pendingNotifications: Notification[],
  markAsRead: (id: string) => Promise<void>,
  markAsCompleted: (id: string) => Promise<void>,
  toast: any
) {
  // Add markAllAsRead functionality that properly updates the database
  const markAllAsRead = useCallback(async () => {
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

  return {
    markAllAsRead,
    clearNotifications
  };
}
