
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { generateMockNotifications } from "@/api/notification/mockNotifications";
import { createErrorNotification, createBasicNotifications } from "@/api/notification/notificationErrors";

// Helper to format notification from database to our type
export const formatNotification = (data: any): Notification => {
  return {
    id: data.id,
    title: data.title || formatTitleFromType(data.notification_type),
    description: data.description || `Notification for ${data.event_name || 'event'}`,
    createdAt: new Date(data.created_at || data.sent_at || new Date()),
    read: Boolean(data.read),
    type: data.notification_type,
    relatedId: data.event_code,
    status: data.read ? "read" : "sent"
  };
};

// Helper to format title from notification type
const formatTitleFromType = (type: string): string => {
  switch (type) {
    case 'event_created':
      return 'New Event Created';
    case 'event_created_unified':
      return 'New Event';
    case 'task_overdue':
      return 'Task Overdue';
    case 'task_upcoming':
      return 'Upcoming Task';
    case 'event_incomplete':
      return 'Incomplete Event';
    case 'final_payment_reminder':
    case 'payment_reminder':
      return 'Payment Reminder';
    case 'document_due_reminder':
      return 'Document Due';
    case 'task_created':
      return 'New Task';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

export const useNotificationOperations = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const maxFetchAttempts = 3;

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    // Prevent concurrent refresh requests and additional fetches while loading
    if (isRefreshingRef.current) {
      console.log("Already refreshing notifications, skipping");
      return;
    }

    isRefreshingRef.current = true;
    setLoading(true);
    
    try {
      console.log("Fetching notifications...");
      fetchAttemptsRef.current += 1;
      
      let formattedNotifications: Notification[] = [];
      
      try {
        // First attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log("Notifications fetched:", data?.length || 0);
        
        if (data && data.length > 0) {
          formattedNotifications = data.map(item => {
            try {
              return formatNotification(item);
            } catch (itemError) {
              console.warn("Error formatting notification item:", itemError);
              // Provide a fallback formatted notification
              return {
                id: item.id || `error-${Date.now()}`,
                title: item.title || 'Notification',
                description: item.description || 'Notification content',
                createdAt: new Date(item.created_at || item.sent_at || new Date()),
                read: Boolean(item.read),
                type: item.notification_type || 'unknown',
                relatedId: item.event_code,
                status: item.read ? "read" : "sent"
              };
            }
          });
        } else {
          // If no data from Supabase, use mock data in development
          if (process.env.NODE_ENV === 'development') {
            console.log("No notifications found in database, using mock data");
            formattedNotifications = generateMockNotifications();
          }
        }
      } catch (dbError) {
        console.warn('Database error when fetching notifications:', dbError);
        
        // Fallback to mock notifications in development environment
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock notifications due to database error");
          formattedNotifications = generateMockNotifications();
        } else {
          // In production, add an error notification
          formattedNotifications = [createErrorNotification(dbError)];
        }
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        setError(null);
        fetchAttemptsRef.current = 0; // Reset counter on success
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (isMountedRef.current) {
        setError(error instanceof Error ? error : new Error('Failed to fetch notifications'));
        
        // If we've reached max attempts, default to empty array to prevent infinite loading
        if (fetchAttemptsRef.current >= maxFetchAttempts) {
          console.warn('Max fetch attempts reached, defaulting to empty array');
          setNotifications([]);
          setUnreadCount(0);
        }
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
