
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that provides actions for interacting with notifications
 */
export function useNotificationActions() {
  const { toast } = useToast();

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  // Mark a notification as completed
  const markAsCompleted = useCallback(async (id: string) => {
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
  }, [toast]);

  return {
    markAsRead,
    markAsCompleted
  };
}
