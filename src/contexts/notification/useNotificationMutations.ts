
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationStatus } from "@/types/notification";
import { toast } from "sonner";
import { retryWithBackoff } from "@/utils/retryWithBackoff";
import { NotificationUpdateError } from "@/types/errors";

interface UseNotificationMutationsProps {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: () => Promise<void>;
  triggerFilterRefresh: () => void;
}

export const useNotificationMutations = ({
  setNotifications,
  setUnreadCount,
  fetchNotifications,
  triggerFilterRefresh
}: UseNotificationMutationsProps) => {
  // Mark a notification as read with retry logic
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Optimistic update
      let notificationUpdated = false;
      
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n.id === id && !n.read) {
            notificationUpdated = true;
            return { 
              ...n, 
              read: true, 
              status: "read" as NotificationStatus 
            };
          }
          return n;
        });
        return updated;
      });
      
      if (notificationUpdated) {
        setUnreadCount(count => Math.max(0, count - 1));
        triggerFilterRefresh();
      }
      
      // Update in database with retry
      await retryWithBackoff(
        async () => {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);
            
          if (error) {
            throw new NotificationUpdateError(
              'Unable to mark as read. Please check your connection.',
              { notificationId: id, originalError: error }
            );
          }
        },
        { maxAttempts: 3, initialDelay: 1000 }
      );
      
      return true;
    } catch (error) {
      toast.error("Could not mark notification as read. Please try again.");
      await fetchNotifications();
      return false;
    }
  }, [setNotifications, setUnreadCount, fetchNotifications, triggerFilterRefresh]);

  // Mark a notification as completed (we'll just mark it as read for simplicity)
  const markAsCompleted = useCallback(async (id: string) => {
    try {
      console.log('Marking notification as completed:', id);
      return await markAsRead(id);
    } catch (error) {
      console.error('Error in markAsCompleted:', error);
      return false;
    }
  }, [markAsRead]);

  // Mark all notifications as read with retry logic
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      setNotifications(prev => {
        const hadUnread = prev.some(n => !n.read);
        if (hadUnread) {
          return prev.map(n => ({ 
            ...n, 
            read: true, 
            status: "read" as NotificationStatus 
          }));
        }
        return prev;
      });
      
      setUnreadCount(0);
      triggerFilterRefresh();
      
      // Update in database with retry
      await retryWithBackoff(
        async () => {
          const { data: unreadNotifications } = await supabase
            .from('notifications')
            .select('id')
            .eq('read', false);
          
          if (!unreadNotifications || unreadNotifications.length === 0) {
            return;
          }
          
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('read', false);
            
          if (error) {
            throw new NotificationUpdateError(
              'Unable to mark all as read. Please try again.',
              { originalError: error }
            );
          }
        },
        { maxAttempts: 3, initialDelay: 1000 }
      );
      
      return true;
    } catch (error) {
      toast.error("Could not mark all notifications as read. Please try again.");
      await fetchNotifications();
      return false;
    }
  }, [setNotifications, setUnreadCount, fetchNotifications, triggerFilterRefresh]);

  // Clear all notifications (not implemented in database, just visual)
  const clearNotifications = useCallback(async () => {
    // In a real implementation, we would delete notifications from the database
    // For now, we'll just clear them from state
    setNotifications([]);
    setUnreadCount(0);
    triggerFilterRefresh();
  }, [setNotifications, setUnreadCount, triggerFilterRefresh]);

  return {
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications
  };
};
