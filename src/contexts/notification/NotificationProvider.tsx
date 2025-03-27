
import React, { useState, useEffect, useRef } from "react";
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

  const {
    notifications,
    unreadCount,
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
    
    return () => {
      window.clearTimeout(fallbackTimeout);
    };
  }, [loading, notificationsState.length]);

  // Update local state when notifications change
  useEffect(() => {
    if (mountedRef.current) {
      setNotificationsState(notifications);
      setUnreadCountState(unreadCount);
    }
  }, [notifications, unreadCount]);

  // Set up realtime notifications
  useRealtimeNotifications(isMountedRef, setNotificationsState, setUnreadCountState);

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationsState,
        unreadCount: unreadCountState,
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
