
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationStatus } from "@/types/notification";
import { toast } from "@/hooks/use-toast";
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
  const markAsRead = useCallback(async (id: string) => {
    try {
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

  const markAsCompleted = useCallback(async (id: string) => {
    try {
      return await markAsRead(id);
    } catch (error) {
      console.error('Error in markAsCompleted:', error);
      return false;
    }
  }, [markAsRead]);

  const markAllAsRead = useCallback(async () => {
    try {
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
      
      await retryWithBackoff(
        async () => {
          const { data: unreadNotifications } = await supabase
            .from('notifications')
            .select('id')
            .eq('read', false);
          
          if (!unreadNotifications || unreadNotifications.length === 0) return;
          
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

  const clearNotifications = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('read', true);
      
      if (error) {
        console.error("Error deleting read notifications:", error);
        toast.error("Could not clear notifications");
        return;
      }
      
      // Remove read notifications from state
      setNotifications(prev => prev.filter(n => !n.read));
      triggerFilterRefresh();
      toast.success("Read notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Could not clear notifications");
    }
  }, [setNotifications, triggerFilterRefresh]);

  return {
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications
  };
};
