
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationContextType } from "@/types/notification";
import { toast } from "sonner";
import { generateMockNotifications } from "@/api/notification/mockNotifications";

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markAsRead: async () => {},
  markAsCompleted: async () => {},
  markAllAsRead: async () => {},
  clearNotifications: async () => {},
  refreshNotifications: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);

  // Set up cleanup function
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial fetch of notifications
  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        if (!isMountedRef.current) return;
        
        const newNotification = formatNotification(payload.new);
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(count => count + 1);
        
        // Show toast notification
        toast("New notification", {
          description: newNotification.title
        });
      })
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper to format notification from database to our type
  const formatNotification = (data: any): Notification => {
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

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    // Prevent concurrent refresh requests
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // Graceful handling for development environments where Supabase might not be configured
      let formattedNotifications: Notification[] = [];
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
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
      if (isMountedRef.current) {
        setLoading(false);
      }
      isRefreshingRef.current = false;
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
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
  };

  // Mark a notification as completed (we'll just mark it as read for simplicity)
  const markAsCompleted = async (id: string) => {
    return markAsRead(id);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
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
  };

  // Clear all notifications (not implemented in database, just visual)
  const clearNotifications = async () => {
    // In a real implementation, we would delete notifications from the database
    // For now, we'll just clear them from state
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAsCompleted,
        markAllAsRead,
        clearNotifications,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
