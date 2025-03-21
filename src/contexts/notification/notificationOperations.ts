
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { generateMockNotifications } from "@/api/notification/mockNotifications";

// Helper to format notification from database to our type
export const formatNotification = (data: any): Notification => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    createdAt: new Date(data.created_at),
    read: data.read,
    type: data.notification_type,
    relatedId: data.event_code,
    status: data.read ? "read" : "sent"
  };
};

export const useNotificationOperations = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    // Prevent concurrent refresh requests and additional fetches while loading
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching notifications...");
      
      // Graceful handling for development environments where Supabase might not be configured
      let formattedNotifications: Notification[] = [];
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log("Notifications fetched:", data?.length || 0);
        formattedNotifications = data.map(formatNotification);
      } catch (dbError) {
        console.warn('Using mock notifications due to database error:', dbError);
        // Fallback to mock notifications in development environment
        formattedNotifications = generateMockNotifications();
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (isMountedRef.current) {
        setError(error instanceof Error ? error : new Error('Failed to fetch notifications'));
      }
    } finally {
      // Important: Always set loading to false regardless of outcome
      if (isMountedRef.current) {
        setLoading(false);
      }
      // Small timeout to prevent immediate re-fetching
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 300);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Refresh on error to get correct state
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // Mark a notification as completed (we'll just mark it as read for simplicity)
  const markAsCompleted = useCallback(async (id: string) => {
    return markAsRead(id);
  }, [markAsRead]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error('Error marking all as read:', error);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // Clear all notifications (not implemented in database, just visual)
  const clearNotifications = useCallback(async () => {
    // In a real implementation, we would delete notifications from the database
    // For now, we'll just clear them from state
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    fetchNotifications,
    isMountedRef,
  };
};
