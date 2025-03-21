
import React, { useState, useEffect, useCallback } from "react";
import { NotificationContext } from "./NotificationContext";
import { useNotificationOperations } from "./notificationOperations";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { Notification } from "@/types/notification";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
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
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up realtime notifications
  const setNotifications = useState<Notification[]>()[1];
  const setUnreadCount = useState<number>(0)[1]; 
  useRealtimeNotifications(isMountedRef, setNotifications, setUnreadCount);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
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
