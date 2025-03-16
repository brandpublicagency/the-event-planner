
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook that provides handlers for notification interactions
 */
export function useNotificationHandlers(
  markAsRead: (id: string) => Promise<void>,
  markAllAsRead: () => void,
  markAsCompleted: (id: string) => Promise<void>,
  refreshNotifications: () => Promise<void>,
  triggerNotificationProcessing: () => Promise<any>
) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewEvent = useCallback((type: 'general' | 'scheduled', id: string, eventCode?: string) => {
    // Mark notification as read
    if (type === 'general') {
      markAsRead(id);
    } else {
      markAsRead(id);
    }
    
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
  }, [markAsRead, navigate, toast]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAllAsRead, toast]);

  const handleCompleteTask = useCallback((type: 'general' | 'scheduled', id: string) => {
    markAsCompleted(id);
    toast({
      title: "Task marked as complete",
      description: "The task has been marked as completed successfully",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAsCompleted, toast]);

  const handleRefresh = useCallback(() => {
    refreshNotifications();
    toast({
      title: "Refreshing notifications",
      description: "Fetching the latest notifications",
      showProgress: true,
      duration: 3000
    });
  }, [refreshNotifications, toast]);

  const handleTriggerProcess = useCallback(() => {
    triggerNotificationProcessing();
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
