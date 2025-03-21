
import { Dispatch, SetStateAction, useCallback } from "react";
import { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that provides actions for interacting with notifications - MOCK version
 */
export function useNotificationActions(
  setNotifications?: Dispatch<SetStateAction<Notification[]>>
) {
  const { toast } = useToast();

  // Local state operations for updating notifications
  const updateLocalState = useCallback((id: string, updates: Partial<Notification>) => {
    if (!setNotifications) return;
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates } 
          : notification
      )
    );
  }, [setNotifications]);

  // Remove notification from local state
  const removeFromLocalState = useCallback((id: string) => {
    if (!setNotifications) return;
    
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, [setNotifications]);

  // Mark as read - mock implementation
  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log(`Marking notification ${id} as read`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      updateLocalState(id, { read: true });
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, [updateLocalState]);

  // Mark as completed - mock implementation
  const markAsCompleted = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log(`Marking notification ${id} as completed`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from local state
      removeFromLocalState(id);
      
      toast({
        title: 'Task completed',
        description: 'The notification has been marked as completed.',
        variant: 'success',
      });
      
      return true;
    } catch (err) {
      console.error('Error marking notification as completed:', err);
      return false;
    }
  }, [removeFromLocalState, toast]);

  // Mark all as read
  const markAllAsRead = useCallback((): void => {
    if (!setNotifications) return;
    
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: 'All notifications marked as read',
      variant: 'default',
    });
  }, [setNotifications, toast]);
  
  // Clear notifications
  const clearNotifications = useCallback((): void => {
    if (!setNotifications) return;
    
    setNotifications([]);
    
    toast({
      title: 'All notifications cleared',
      variant: 'default',
    });
  }, [setNotifications, toast]);

  return {
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    updateLocalState,
    removeFromLocalState
  };
}
