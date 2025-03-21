
import React, { useState, useEffect, useRef } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./notificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [unreadCountState, setUnreadCountState] = useState<number>(0);
  const initialFetchDoneRef = useRef(false);

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
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef]);

  // Set up initial fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!initialFetchDoneRef.current) {
        initialFetchDoneRef.current = true;
        await fetchNotifications();
      }
    };
    
    fetchData();
  }, [fetchNotifications]);

  // Update local state when notifications change
  useEffect(() => {
    setNotificationsState(notifications);
    setUnreadCountState(unreadCount);
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
