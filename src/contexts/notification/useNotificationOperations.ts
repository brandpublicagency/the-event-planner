
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { useNotificationFetching } from "./useNotificationFetching";
import { useNotificationMutations } from "./useNotificationMutations";

export const useNotificationOperations = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);

  // Import functionality from separate hooks
  const { fetchNotifications } = useNotificationFetching({
    setNotifications,
    setUnreadCount,
    setLoading,
    setError,
    isMountedRef,
    isRefreshingRef
  });

  const { 
    markAsRead, 
    markAsCompleted, 
    markAllAsRead, 
    clearNotifications 
  } = useNotificationMutations({
    setNotifications,
    setUnreadCount,
    fetchNotifications
  });

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    fetchNotifications,
    isMountedRef,
  };
};

// Re-export the formatNotification function to maintain backward compatibility
export { formatNotification } from "./notificationFormatters";
