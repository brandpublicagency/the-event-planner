
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
      
      // Optimistic update - Update locally first
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n.id === id) {
            console.log(`Optimistically updating notification ${id} to read=true`);
            return { 
              ...n, 
              read: true, 
              status: "read" as NotificationStatus 
            };
          }
          return n;
        });
        console.log('Updated notifications state after optimistic update:', updated);
        return updated;
      });
      
      // Update unread count
      setUnreadCount(count => Math.max(0, count - 1));
      
      // Then update in the database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating notification in database:', error);
        throw error;
      }
      
      console.log(`Successfully marked notification ${id} as read in database`);
      
      // Force a refresh to ensure filters are correctly applied
      await fetchNotifications();
      
      // Log the state after server update
      console.log('Notification marked as read, refreshed state');
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Refresh on error to get correct state
      toast.error("Failed to mark notification as read");
      fetchNotifications();
      return false;
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
      
      // Get unread notifications first to know what to update
      const unreadNotifications = await supabase
        .from('notifications')
        .select('id')
        .eq('read', false);
        
      if (unreadNotifications.error) throw unreadNotifications.error;
      
      // Update locally first
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
      
      // Update in the database
      if (unreadNotifications.data && unreadNotifications.data.length > 0) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('read', false);
          
        if (error) throw error;
        
        console.log(`Successfully marked ${unreadNotifications.data.length} notifications as read in database`);
      }
      
      // Force a refresh to ensure filters are correctly applied
      await fetchNotifications();
      console.log('State refreshed after marking all as read');
      
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error("Failed to mark all notifications as read");
      fetchNotifications();
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
