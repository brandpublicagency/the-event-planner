
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';

/**
 * Hook that provides handlers for notification interactions
 */
export function useNotificationHandlers(
  markAsRead: (id: string) => Promise<void>,
  markAllAsRead: () => void,
  markScheduledAsRead: (id: string) => Promise<void>,
  markAsCompleted: (id: string) => Promise<void>,
  refreshNotifications: () => Promise<void>,
  triggerNotificationProcessing: () => Promise<any>
) {
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Handle viewing a notification - marks as read and navigates to related content
   */
  const handleViewEvent = useCallback(async (type: 'general' | 'scheduled' | 'unified', id: string, relatedId?: string) => {
    try {
      // Try to mark as read in both systems - one will succeed based on where the notification exists
      await Promise.allSettled([
        markAsRead(id),
        markScheduledAsRead?.(id)
      ]);
      
      toast({
        title: "Notification marked as read",
        variant: "success",
        duration: 3000
      });
      
      // Navigate based on notification type
      if (relatedId) {
        // Handle different related ID formats
        if (relatedId.startsWith('event_')) {
          navigate(`/events/${relatedId}`);
        } else if (relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${relatedId}`);
        } else if (relatedId.startsWith('doc_')) {
          // Extract the document ID from the doc_ prefix
          const docId = relatedId.replace('doc_', '');
          navigate(`/documents?document=${docId}`);
        } else {
          // Default to navigating to the related ID as-is
          navigate(`/${relatedId}`);
        }
      } else {
        // Default to dashboard if no related ID
        navigate('/');
      }
    } catch (error) {
      console.error("Error handling notification view:", error);
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [markAsRead, markScheduledAsRead, navigate, toast]);

  /**
   * Mark all notifications as read
   */
  const handleMarkAllRead = useCallback(async () => {
    try {
      markAllAsRead();
      toast({
        title: "All notifications marked as read",
        variant: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Could not mark all notifications as read",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [markAllAsRead, toast]);

  /**
   * Complete a task from a notification
   */
  const handleCompleteTask = useCallback(async (type: 'general' | 'scheduled' | 'unified', id: string) => {
    try {
      await markAsCompleted(id);
      toast({
        title: "Task marked as complete",
        description: "The task has been marked as completed successfully",
        variant: "success",
        duration: 3000
      });
      
      // Navigate to tasks page to show updated task list
      navigate('/tasks');
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Could not mark task as complete",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [markAsCompleted, navigate, toast]);

  /**
   * Refresh notifications
   */
  const handleRefresh = useCallback(async () => {
    try {
      await refreshNotifications();
      toast({
        title: "Notifications refreshed",
        description: "Latest notifications have been fetched",
        variant: "success",
        duration: 2000
      });
    } catch (error) {
      console.error("Error refreshing notifications:", error);
      toast({
        title: "Error",
        description: "Could not refresh notifications",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [refreshNotifications, toast]);

  /**
   * Trigger notification processing on the server
   */
  const handleTriggerProcess = useCallback(async () => {
    try {
      await triggerNotificationProcessing();
      toast({
        title: "Notification processing triggered",
        description: "Server is processing scheduled notifications",
        variant: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Error triggering notification processing:", error);
      toast({
        title: "Error",
        description: "Could not trigger notification processing",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [triggerNotificationProcessing, toast]);

  return {
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  };
}
