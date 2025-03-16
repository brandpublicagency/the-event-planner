
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook that provides action handlers for the notification page
 */
export function useNotificationPageActions(
  markAsRead,
  markAsCompleted,
  refreshNotifications
) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handler for viewing event details
  const handleViewEvent = useCallback((listType: string, notificationId: string, eventCode?: string) => {
    if (!eventCode) return;
    
    // Mark as read before navigation
    markAsRead(notificationId).then(() => {
      navigate(`/events/${eventCode}`);
    });
  }, [markAsRead, navigate]);

  // Handler for marking all notifications as read
  const handleMarkAllRead = useCallback(async () => {
    try {
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read",
        variant: "success"
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [toast]);

  // Handler for task completion
  const handleCompleteTask = useCallback((listType: string, notificationId: string) => {
    markAsCompleted(notificationId).then(() => {
      toast({
        title: "Task completed",
        description: "The task has been marked as completed",
        variant: "success"
      });
    }).catch(error => {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete the task",
        variant: "destructive"
      });
    });
  }, [markAsCompleted, toast]);

  // Handler for refreshing the list
  const handleRefresh = useCallback(async () => {
    try {
      await refreshNotifications();
      toast({
        title: "Refreshed",
        description: "Notification list has been refreshed",
        variant: "success",
        duration: 2000
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      return Promise.reject(error);
    }
  }, [refreshNotifications, toast]);

  return {
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh
  };
}
