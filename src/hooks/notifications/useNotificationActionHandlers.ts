
import { useCallback } from 'react';
import { useNotificationActions } from './useNotificationActions';
import { useToast } from '@/hooks/use-toast';

export function useNotificationActionHandlers(
  state: ReturnType<typeof import('./useNotificationState').useNotificationState>,
  debouncedFetch: ReturnType<typeof import('lodash').debounce>
) {
  const { toast } = useToast();
  const { setPendingNotifications, isMounted } = state;
  
  // Use the notification actions hook
  const { markAsRead, markAsCompleted } = useNotificationActions();

  // Override markAsRead to update local state with optimistic updates
  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      // Optimistic update
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          )
        );
      }
      
      const result = await markAsRead(id);
      
      // If the operation failed, revert the optimistic update
      if (!result && isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id && notification.read
              ? { ...notification, read: false } 
              : notification
          )
        );
        
        toast({
          title: 'Failed to mark as read',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Revert optimistic update on error
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id && notification.read
              ? { ...notification, read: false } 
              : notification
          )
        );
      }
      
      throw error;
    }
  }, [markAsRead, setPendingNotifications, isMounted, toast]);

  // Override markAsCompleted to update local state with optimistic updates
  const handleMarkAsCompleted = useCallback(async (id: string) => {
    try {
      // Optimistic update - remove from local state
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.filter(notification => notification.id !== id)
        );
      }
      
      const result = await markAsCompleted(id);
      
      // If the operation failed, revert the optimistic update by fetching fresh data
      if (!result) {
        console.warn('Failed to mark notification as completed, refreshing data');
        if (isMounted.current) {
          debouncedFetch();
          toast({
            title: 'Failed to complete notification',
            description: 'Please try again.',
            variant: 'destructive',
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      
      // Revert optimistic update on error by fetching fresh data
      if (isMounted.current) {
        debouncedFetch();
      }
      
      throw error;
    }
  }, [markAsCompleted, setPendingNotifications, isMounted, toast, debouncedFetch]);

  return {
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted
  };
}
