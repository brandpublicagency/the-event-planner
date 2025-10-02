
import React, { useState, useEffect, useRef, useCallback } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./useNotificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";
import { toast } from "sonner";

const BACKGROUND_REFRESH_INTERVAL = 300000; // 5 minutes
const STALE_DATA_THRESHOLD = 300000; // 5 minutes
const INACTIVE_REFRESH_INTERVAL = 600000; // 10 minutes when inactive

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [unreadCountState, setUnreadCountState] = useState<number>(0);
  const initialFetchDoneRef = useRef(false);
  const mountedRef = useRef(true);
  const initialFetchTimeoutRef = useRef<number | null>(null);
  const lastFilterRefreshRef = useRef<number>(Date.now());
  const lastNotificationUpdateRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const isTabVisibleRef = useRef<boolean>(true);

  // Function to trigger filter refresh by updating the timestamp
  const triggerFilterRefresh = useCallback(() => {
    lastFilterRefreshRef.current = Date.now();
    lastNotificationUpdateRef.current = Date.now();
    console.log(`NotificationProvider: Triggered filter refresh, timestamp: ${lastFilterRefreshRef.current}`);
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

  // Set up cleanup function
  useEffect(() => {
    console.log("NotificationProvider mounted");
    mountedRef.current = true;
    isMountedRef.current = true;
    
    // Fetch notifications immediately when component mounts
    if (!initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      console.log("Initial notifications fetch");
      fetchNotifications().catch((err) => {
        console.error("Error in initial notification fetch:", err);
        if (mountedRef.current) {
          toast.error("Could not load notifications");
        }
      });
    }
    
    return () => {
      console.log("NotificationProvider unmounted");
      mountedRef.current = false;
      isMountedRef.current = false;
      
      // Clear any lingering timeouts
      if (initialFetchTimeoutRef.current) {
        window.clearTimeout(initialFetchTimeoutRef.current);
      }
    };
  }, [fetchNotifications]);

  // Set up initial fetch with a timeout to prevent blocking the UI
  useEffect(() => {
    // Set a fallback timeout to ensure we show something even if fetch is slow
    const fallbackTimeout = window.setTimeout(() => {
      if (mountedRef.current && notificationsState.length === 0 && loading) {
        console.log("Fallback timeout triggered for notifications");
        // Force loading to false after 5 seconds
        if (isMountedRef.current) {
          // Set empty notifications if nothing loaded after timeout
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
    // Track user activity
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    
    // Track tab visibility
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      isTabVisibleRef.current = isVisible;
      
      if (isVisible) {
        // Refresh if data is stale when tab becomes visible
        const timeSinceUpdate = Date.now() - lastNotificationUpdateRef.current;
        if (timeSinceUpdate > STALE_DATA_THRESHOLD) {
          fetchNotifications().catch(err => {
            console.error("Error refreshing notifications on tab focus:", err);
          });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Smart refresh interval
    const refreshInterval = window.setInterval(() => {
      if (!mountedRef.current || !isTabVisibleRef.current) {
        return;
      }
      
      const timeSinceUpdate = Date.now() - lastNotificationUpdateRef.current;
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      const isUserActive = timeSinceActivity < 60000; // Active in last minute
      
      // Use different intervals based on activity
      const threshold = isUserActive ? BACKGROUND_REFRESH_INTERVAL : INACTIVE_REFRESH_INTERVAL;
      
      if (timeSinceUpdate > threshold) {
        fetchNotifications().catch(err => {
          console.error("Error in background notification refresh:", err);
        });
      }
    }, 60000); // Check every minute
    
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

  // Wrapped operations with filter refresh
  const wrappedMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    triggerFilterRefresh();
    return success;
  };

  const wrappedMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    triggerFilterRefresh();
    return success;
  };

  const wrappedMarkAsCompleted = async (id: string) => {
    const success = await markAsCompleted(id);
    triggerFilterRefresh();
    return success;
  };

  const wrappedRefreshNotifications = async () => {
    await fetchNotifications(true);
    triggerFilterRefresh();
    return true;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationsState,
        unreadCount: unreadCountState,
        loading,
        error,
        markAsRead: wrappedMarkAsRead,
        markAsCompleted: wrappedMarkAsCompleted,
        markAllAsRead: wrappedMarkAllAsRead,
        clearNotifications,
        refreshNotifications: wrappedRefreshNotifications,
        lastFilterRefresh: lastFilterRefreshRef.current,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
