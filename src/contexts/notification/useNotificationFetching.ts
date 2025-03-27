
import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateMockNotifications } from "@/api/notification/mockNotifications";
import { createErrorNotification } from "@/api/notification/notificationErrors";
import { Notification } from "@/types/notification";
import { formatNotification } from "./notificationFormatters";

interface UseNotificationFetchingProps {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  isMountedRef: React.MutableRefObject<boolean>;
  isRefreshingRef: React.MutableRefObject<boolean>;
}

export const useNotificationFetching = ({
  setNotifications,
  setUnreadCount,
  setLoading,
  setError,
  isMountedRef,
  isRefreshingRef
}: UseNotificationFetchingProps) => {
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
                createdAt: new Date(item.created_at || new Date()),
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
  }, [setLoading, setNotifications, setUnreadCount, setError, isMountedRef, isRefreshingRef]);

  return {
    fetchNotifications
  };
};
