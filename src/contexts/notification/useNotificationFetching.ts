
import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateMockNotifications } from "@/api/notification/mockNotifications";
import { createErrorNotification } from "@/api/notification/notificationErrors";
import { Notification } from "@/types/notification";
import { formatNotification } from "./notificationFormatters";
import { retryWithBackoff } from "@/utils/retryWithBackoff";
import { NotificationFetchError } from "@/types/errors";

const NOTIFICATION_LIMIT = 50;

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
  const lastFetchTimeRef = useRef<number>(0);
  const minTimeBetweenFetches = 2000;

  const fetchNotifications = useCallback(async (force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (isRefreshingRef.current) return;
    if (!force && timeSinceLastFetch < minTimeBetweenFetches) return;

    isRefreshingRef.current = true;
    setLoading(true);
    lastFetchTimeRef.current = now;
    
    try {
      fetchAttemptsRef.current += 1;
      
      let formattedNotifications: Notification[] = [];
      
      try {
        const { data, error } = await retryWithBackoff(
          async () => {
            const result = await supabase
              .from('notifications')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(NOTIFICATION_LIMIT);
            
            if (result.error) {
              throw new NotificationFetchError(
                'Unable to fetch notifications. Please check your connection.',
                { originalError: result.error }
              );
            }
            
            return result;
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 4000,
          }
        );

        if (error) throw error;
        
        if (data && data.length > 0) {
          formattedNotifications = data.map(item => {
            try {
              return formatNotification(item);
            } catch (itemError) {
              console.warn("Error formatting notification item:", itemError);
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
        } else if (process.env.NODE_ENV === 'development') {
          formattedNotifications = generateMockNotifications();
        }
      } catch (dbError) {
        if (process.env.NODE_ENV === 'development') {
          formattedNotifications = generateMockNotifications();
        } else {
          formattedNotifications = [createErrorNotification(dbError)];
        }
      }

      if (isMountedRef.current) {
        setNotifications(formattedNotifications);
        const unreadCount = formattedNotifications.filter(n => !n.read).length;
        setUnreadCount(unreadCount);
        setError(null);
        fetchAttemptsRef.current = 0;
        
        try {
          localStorage.setItem('cached_notifications', JSON.stringify({
            notifications: formattedNotifications,
            timestamp: Date.now()
          }));
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError(error instanceof Error ? error : new Error('Network error. Please try again.'));
        
        try {
          const cached = localStorage.getItem('cached_notifications');
          if (cached) {
            const { notifications: cachedNotifs } = JSON.parse(cached);
            setNotifications(cachedNotifs);
            setUnreadCount(cachedNotifs.filter((n: Notification) => !n.read).length);
          }
        } catch (e) {
          if (fetchAttemptsRef.current >= maxFetchAttempts) {
            setNotifications([]);
            setUnreadCount(0);
          }
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 300);
    }
  }, [setLoading, setNotifications, setUnreadCount, setError, isMountedRef, isRefreshingRef]);

  return {
    fetchNotifications
  };
};
