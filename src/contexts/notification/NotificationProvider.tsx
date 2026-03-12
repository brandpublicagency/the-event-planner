
import React, { useState, useEffect, useRef, useCallback } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./useNotificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";
import { toast } from "@/hooks/use-toast";

const BACKGROUND_REFRESH_INTERVAL = 300000; // 5 minutes
const STALE_DATA_THRESHOLD = 300000; // 5 minutes
const INACTIVE_REFRESH_INTERVAL = 600000; // 10 minutes when inactive

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [unreadCountState, setUnreadCountState] = useState<number>(0);
  const [lastFilterRefresh, setLastFilterRefresh] = useState<number>(Date.now());
  const initialFetchDoneRef = useRef(false);
  const mountedRef = useRef(true);
  const initialFetchTimeoutRef = useRef<number | null>(null);
  const lastNotificationUpdateRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const isTabVisibleRef = useRef<boolean>(true);

  const triggerFilterRefresh = useCallback(() => {
    setLastFilterRefresh(Date.now());
    lastNotificationUpdateRef.current = Date.now();
  }, []);

  const {
    notifications,
    unreadCount: operationsUnreadCount,
    loading,
    error,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    fetchNotifications,
    isMountedRef
  } = useNotificationOperations();

  useEffect(() => {
    mountedRef.current = true;
    isMountedRef.current = true;
    
    if (!initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchNotifications().catch((err) => {
        console.error("Error in initial notification fetch:", err);
        if (mountedRef.current) {
          toast.error("Could not load notifications");
        }
      });
    }
    
    return () => {
      mountedRef.current = false;
      isMountedRef.current = false;
      if (initialFetchTimeoutRef.current) {
        window.clearTimeout(initialFetchTimeoutRef.current);
      }
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const fallbackTimeout = window.setTimeout(() => {
      if (mountedRef.current && notificationsState.length === 0 && loading) {
        if (isMountedRef.current) {
          setNotificationsState([]);
          setUnreadCountState(0);
        }
      }
    }, 5000);
    
    initialFetchTimeoutRef.current = fallbackTimeout;
    
    return () => {
      window.clearTimeout(fallbackTimeout);
    };
  }, [loading, notificationsState.length]);

  // Smart refresh based on tab visibility and user activity
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      isTabVisibleRef.current = isVisible;
      
      if (isVisible) {
        const timeSinceUpdate = Date.now() - lastNotificationUpdateRef.current;
        if (timeSinceUpdate > STALE_DATA_THRESHOLD) {
          fetchNotifications().catch(err => {
            console.error("Error refreshing notifications on tab focus:", err);
          });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const refreshInterval = window.setInterval(() => {
      if (!mountedRef.current || !isTabVisibleRef.current) return;
      
      const timeSinceUpdate = Date.now() - lastNotificationUpdateRef.current;
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      const isUserActive = timeSinceActivity < 60000;
      const threshold = isUserActive ? BACKGROUND_REFRESH_INTERVAL : INACTIVE_REFRESH_INTERVAL;
      
      if (timeSinceUpdate > threshold) {
        fetchNotifications().catch(err => {
          console.error("Error in background notification refresh:", err);
        });
      }
    }, 60000);
    
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNotifications]);

  // Update local state when notifications change
  useEffect(() => {
    if (mountedRef.current) {
      setNotificationsState(notifications);
      setUnreadCountState(operationsUnreadCount);
      lastNotificationUpdateRef.current = Date.now();
    }
  }, [notifications, operationsUnreadCount]);

  // Set up realtime notifications
  useRealtimeNotifications({
    isMountedRef, 
    setNotifications: setNotificationsState, 
    setUnreadCount: setUnreadCountState, 
    fetchNotifications,
    triggerFilterRefresh
  });

  const wrappedMarkAsRead = useCallback(async (id: string) => {
    const success = await markAsRead(id);
    triggerFilterRefresh();
    return success;
  }, [markAsRead, triggerFilterRefresh]);

  const wrappedMarkAllAsRead = useCallback(async () => {
    const success = await markAllAsRead();
    triggerFilterRefresh();
    return success;
  }, [markAllAsRead, triggerFilterRefresh]);

  const wrappedMarkAsCompleted = useCallback(async (id: string) => {
    const success = await markAsCompleted(id);
    triggerFilterRefresh();
    return success;
  }, [markAsCompleted, triggerFilterRefresh]);

  const wrappedRefreshNotifications = useCallback(async () => {
    await fetchNotifications(true);
    triggerFilterRefresh();
    return true;
  }, [fetchNotifications, triggerFilterRefresh]);

  const contextValue = React.useMemo(() => ({
    notifications: notificationsState,
    unreadCount: unreadCountState,
    loading,
    error,
    markAsRead: wrappedMarkAsRead,
    markAsCompleted: wrappedMarkAsCompleted,
    markAllAsRead: wrappedMarkAllAsRead,
    clearNotifications,
    refreshNotifications: wrappedRefreshNotifications,
    lastFilterRefresh,
  }), [notificationsState, unreadCountState, loading, error, wrappedMarkAsRead, wrappedMarkAsCompleted, wrappedMarkAllAsRead, clearNotifications, wrappedRefreshNotifications, lastFilterRefresh]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
