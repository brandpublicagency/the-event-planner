
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
    };
  }, [isMountedRef]);

  // Set up initial fetch with a timeout to prevent blocking the UI
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialFetchDoneRef.current && mountedRef.current) {
        initialFetchDoneRef.current = true;
        fetchNotifications().catch((err) => {
          console.error("Error in initial notification fetch:", err);
        });
      }
    }, 500); // Small delay to let the UI render first
    
    return () => {
      clearTimeout(timer);
    };
  }, [fetchNotifications]);

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
