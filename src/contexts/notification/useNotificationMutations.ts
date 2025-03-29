
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

interface UseNotificationMutationsProps {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationMutations = ({
  setNotifications,
  setUnreadCount,
  fetchNotifications
}: UseNotificationMutationsProps) => {
  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      console.log('Marking notification as read:', id);
      
      // Update locally first (optimistic update)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true, status: "read" } : n)
      );
      setUnreadCount(count => Math.max(0, count - 1));
      
      // Then update in the database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // The real-time subscription will handle the UI update,
      // but we'll also wait a bit and refresh to be certain
      setTimeout(() => {
        console.log('Refreshing notifications after mark as read');
        fetchNotifications().catch(err => {
          console.error('Error refreshing notifications after mark as read:', err);
        });
      }, 300);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Refresh on error to get correct state
      fetchNotifications();
    }
  }, [setNotifications, setUnreadCount, fetchNotifications]);

  // Mark a notification as completed (we'll just mark it as read for simplicity)
  const markAsCompleted = useCallback(async (id: string) => {
    return markAsRead(id);
  }, [markAsRead]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      console.log('Marking all notifications as read');
      
      // Update locally first
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, status: "read" }))
      );
      setUnreadCount(0);
      
      // Then update in the database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
        
      if (error) throw error;
      
      // The real-time subscription will handle the UI update,
      // but we'll also wait a bit and refresh to be certain
      setTimeout(() => {
        console.log('Refreshing notifications after mark all as read');
        fetchNotifications().catch(err => {
          console.error('Error refreshing notifications after mark all as read:', err);
        });
      }, 300);
    } catch (error) {
      console.error('Error marking all as read:', error);
      fetchNotifications();
    }
  }, [setNotifications, setUnreadCount, fetchNotifications]);

  // Clear all notifications (not implemented in database, just visual)
  const clearNotifications = useCallback(async () => {
    // In a real implementation, we would delete notifications from the database
    // For now, we'll just clear them from state
    setNotifications([]);
    setUnreadCount(0);
  }, [setNotifications, setUnreadCount]);

  return {
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications
  };
};
