
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification } from "@/types/notification";
import { toast } from "@/hooks/use-toast";
import { navigateToNotificationTarget } from "@/utils/notificationNavigation";

export const useDashboardNotifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    error
  } = useNotifications();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  useEffect(() => {
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
      refreshNotifications().catch(err => {
        console.error('Error refreshing notifications in dashboard:', err);
      });
    }
  }, [refreshNotifications, initialLoadAttempted]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshNotifications().catch(err => {
      console.error("Error manually refreshing notifications:", err);
    }).finally(() => {
      setIsRefreshing(false);
    });
  }, [refreshNotifications]);

  const handleNotificationView = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsRead(notification.id);
      navigateToNotificationTarget(notification, navigate);
      toast.success("Notification marked as read");
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error("Could not process notification");
    }
  }, [markAsRead, navigate]);

  const handleNotificationComplete = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsCompleted(notification.id);
      toast.success("Task marked as complete");
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      toast.error("Could not complete notification");
    }
  }, [markAsCompleted]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Could not mark all notifications as read");
    }
  }, [markAllAsRead]);

  const handleViewAllNotifications = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/notifications');
  }, [navigate]);

  const limitedNotifications = notifications.slice(0, 3);
  
  return {
    notifications,
    limitedNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
    loading,
    isRefreshing,
    error,
    handleRefresh,
    handleNotificationView,
    handleNotificationComplete,
    handleMarkAllAsRead,
    handleViewAllNotifications,
  };
};
