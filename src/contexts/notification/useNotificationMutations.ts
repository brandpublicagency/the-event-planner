
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationStatus } from "@/types/notification";
import { toast } from "sonner";

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
      
      // First update in the database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating notification in database:', error);
        throw error;
      }
      
      console.log(`Successfully marked notification ${id} as read in database`);
      
      // After database update succeeds, update the local state optimistically
      // This will be confirmed by the realtime update
      let notificationUpdated = false;
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n.id === id && !n.read) {
            console.log(`Optimistically updating notification ${id} to read=true in local state`);
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
      
      // Only update unread count if we actually updated a notification
      if (notificationUpdated) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to mark notification as read");
      await fetchNotifications();
      return false;
    }
  }, [setNotifications, setUnreadCount, fetchNotifications]);

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

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      console.log('Marking all notifications as read');
      
      // Get unread notifications first to know what to update
      const { data: unreadNotifications, error: fetchError } = await supabase
        .from('notifications')
        .select('id')
        .eq('read', false);
        
      if (fetchError) {
        console.error('Error fetching unread notifications:', fetchError);
        throw fetchError;
      }
      
      const unreadCount = unreadNotifications?.length || 0;
      console.log(`Found ${unreadCount} unread notifications`);
      
      // Only proceed if there are unread notifications
      if (unreadCount === 0) {
        console.log('No unread notifications to update');
        return true;
      }
      
      // Update in the database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
          
      if (error) {
        console.error('Error updating all notifications in database:', error);
        throw error;
      }
      
      console.log(`Successfully marked ${unreadCount} notifications as read in database`);
      
      // After database update succeeds, update the local state optimistically
      // This will be confirmed by the realtime update
      setNotifications(prev => {
        const updated = prev.map(n => ({ 
          ...n, 
          read: true, 
          status: "read" as NotificationStatus 
        }));
        console.log('Updated all notifications to read=true in local state');
        return updated;
      });
      
      setUnreadCount(0);
      
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error("Failed to mark all notifications as read");
      await fetchNotifications();
      return false;
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
