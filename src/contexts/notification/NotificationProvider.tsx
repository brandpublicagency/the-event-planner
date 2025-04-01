
import React, { useState, useEffect, useRef, useCallback } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./useNotificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";
import { toast } from "sonner";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [unreadCountState, setUnreadCountState] = useState<number>(0);
  const initialFetchDoneRef = useRef(false);
  const mountedRef = useRef(true);
  const initialFetchTimeoutRef = useRef<number | null>(null);
  const lastFilterRefreshRef = useRef<number>(Date.now());
  const lastNotificationUpdateRef = useRef<number>(Date.now());

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

  // Periodic refetch to ensure data consistency
  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      // Only refresh if the component is mounted and we haven't updated recently
      if (mountedRef.current && Date.now() - lastNotificationUpdateRef.current > 60000) {
        console.log("Performing background notification refresh");
        fetchNotifications().catch(err => {
          console.error("Error in background notification refresh:", err);
        });
      }
    }, 300000); // Every 5 minutes
    
    return () => {
      window.clearInterval(refreshInterval);
    };
  }, [fetchNotifications]);

  // Update local state when notifications change
  useEffect(() => {
    if (mountedRef.current) {
      console.log("Updating local state with notifications:", notifications.length);
      console.log("Unread count:", operationsUnreadCount);
      
      setNotificationsState(notifications);
      setUnreadCountState(operationsUnreadCount);
      
      // Logging notification read status distribution for debugging
      const readCount = notifications.filter(n => n.read).length;
      const unreadCount = notifications.filter(n => !n.read).length;
      console.log(`Notification status: Read: ${readCount}, Unread: ${unreadCount}, Total: ${notifications.length}`);
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

  // Expose notification operations with additional debug logging
  const wrappedMarkAsRead = async (id: string) => {
    console.log(`NotificationProvider.markAsRead called for id: ${id}`);
    try {
      const success = await markAsRead(id);
      
      // Force a refresh of the filter views with a new timestamp
      triggerFilterRefresh();
      
      // Log the result of the operation
      console.log(`markAsRead operation ${success ? 'succeeded' : 'failed'} for notification ${id}`);
      console.log(`Current lastFilterRefresh is ${lastFilterRefreshRef.current}`);
      
      return success;
    } catch (error) {
      console.error("Error in wrappedMarkAsRead:", error);
      return false;
    }
  };

  const wrappedMarkAllAsRead = async () => {
    console.log("NotificationProvider.markAllAsRead called");
    try {
      const success = await markAllAsRead();
      
      // Force a refresh of the filter views with a new timestamp
      triggerFilterRefresh();
      
      // Log the result of the operation
      console.log(`markAllAsRead operation ${success ? 'succeeded' : 'failed'}`);
      console.log(`Current lastFilterRefresh is ${lastFilterRefreshRef.current}`);
      
      return success;
    } catch (error) {
      console.error("Error in wrappedMarkAllAsRead:", error);
      return false;
    }
  };

  const wrappedMarkAsCompleted = async (id: string) => {
    console.log(`NotificationProvider.markAsCompleted called for id: ${id}`);
    try {
      const success = await markAsCompleted(id);
      
      // Force a refresh of the filter views
      triggerFilterRefresh();
      
      return success;
    } catch (error) {
      console.error("Error in wrappedMarkAsCompleted:", error);
      return false;
    }
  };

  // Create a function to explicitly refresh notifications
  const wrappedRefreshNotifications = async () => {
    console.log("NotificationProvider.refreshNotifications called");
    try {
      await fetchNotifications(true); // Force refresh
      // Force filter refresh after fetch
      triggerFilterRefresh();
      return true;
    } catch (error) {
      console.error("Error in wrappedRefreshNotifications:", error);
      return false;
    }
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
