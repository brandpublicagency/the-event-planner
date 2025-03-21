
import React, { useState, useEffect, useRef } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./notificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";

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
    return () => {
      mountedRef.current = false;
      isMountedRef.current = false;
      
      // Clear any lingering timeouts
      if (initialFetchTimeoutRef.current) {
        window.clearTimeout(initialFetchTimeoutRef.current);
      }
    };
  }, [isMountedRef]);

  // Set up initial fetch with a timeout to prevent blocking the UI
  useEffect(() => {
    // Set a shorter timeout for the initial fetch
    initialFetchTimeoutRef.current = window.setTimeout(() => {
      if (!initialFetchDoneRef.current && mountedRef.current) {
        initialFetchDoneRef.current = true;
        fetchNotifications().catch((err) => {
          console.error("Error in initial notification fetch:", err);
        });
      }
    }, 300); // Small delay to let the UI render first
    
    // Set a fallback timeout to ensure we show something even if fetch is slow
    const fallbackTimeout = window.setTimeout(() => {
      if (mountedRef.current && notificationsState.length === 0) {
        // If no notifications loaded after 5 seconds, initialize with empty array
        setNotificationsState([]);
      }
    }, 5000);
    
    return () => {
      if (initialFetchTimeoutRef.current) {
        window.clearTimeout(initialFetchTimeoutRef.current);
      }
      window.clearTimeout(fallbackTimeout);
    };
  }, [fetchNotifications, notificationsState.length]);

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
