
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

  const handleViewEvent = useCallback(async (type: 'general' | 'scheduled' | 'unified', id: string, eventCode?: string) => {
    try {
      // Try to mark as read in both systems - one will succeed based on where the notification exists
      await Promise.allSettled([
        markAsRead(id),
        markScheduledAsRead(id)
      ]);
      
      // Navigate to event if we have an event code
      if (eventCode) {
        navigate(`/events/${eventCode}`);
      }
      
      toast({
        title: "Notification marked as read",
        variant: "success",
        showProgress: true,
        duration: 3000
      });
    } catch (error) {
      console.error("Error handling notification view:", error);
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive",
        showProgress: true,
        duration: 3000
      });
    }
  }, [markAsRead, markScheduledAsRead, navigate, toast]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAllAsRead, toast]);

  const handleCompleteTask = useCallback(async (type: 'general' | 'scheduled' | 'unified', id: string) => {
    try {
      await markAsCompleted(id);
      toast({
        title: "Task marked as complete",
        description: "The task has been marked as completed successfully",
        variant: "success",
        showProgress: true,
        duration: 3000
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Could not mark task as complete",
        variant: "destructive",
        showProgress: true,
        duration: 3000
      });
    }
  }, [markAsCompleted, toast]);

  const handleRefresh = useCallback(async () => {
    await refreshNotifications();
    toast({
      title: "Refreshing notifications",
      description: "Fetching the latest notifications",
      showProgress: true,
      duration: 3000
    });
  }, [refreshNotifications, toast]);

  const handleTriggerProcess = useCallback(async () => {
    await triggerNotificationProcessing();
    toast({
      title: "Processing notifications",
      description: "Checking for scheduled notifications",
      showProgress: true,
      duration: 3000
    });
  }, [triggerNotificationProcessing, toast]);

  return {
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  };
}
