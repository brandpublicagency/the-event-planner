
import { Dispatch, SetStateAction, useCallback } from "react";
import { Notification } from "@/types/notification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that provides actions for interacting with notifications
 * Combines local state management and database operations
 */
export function useNotificationActions(
  setNotifications?: Dispatch<SetStateAction<Notification[]>>
) {
  const { toast } = useToast();

  // Local state operations (from the .ts version)
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

  const removeFromLocalState = useCallback((id: string) => {
    if (!setNotifications) return;
    
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, [setNotifications]);

  // Database operations (from the .tsx version)
  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      
      // Update local state if available
      updateLocalState(id, { read: true });
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, [updateLocalState]);

  const markAsCompleted = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_notifications')
        .update({ 
          is_completed: true, 
          is_read: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as completed:', error);
        return false;
      }

      // Remove from local state if available
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

  // Additional methods from the .ts version
  const markAllAsRead = useCallback((): void => {
    if (!setNotifications) return;
    
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, [setNotifications]);
  
  const clearNotifications = useCallback((): void => {
    if (!setNotifications) return;
    
    setNotifications([]);
  }, [setNotifications]);

  return {
    // Database operations
    markAsRead,
    markAsCompleted,
    
    // Local state operations
    markAllAsRead,
    clearNotifications,
    updateLocalState,
    removeFromLocalState
  };
}
