
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification } from "@/types/notification";
import { toast } from "sonner";

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
      
      if (notification.relatedId) {
        
        
        if (notification.relatedId.match(/^\d+-\d+$/) || 
            notification.relatedId.startsWith('EVENT-') || 
            notification.relatedId.startsWith('event_') ||
            notification.relatedId.match(/^[A-Z]+-\d+-\d+$/)) {  // Added pattern for COR-2503-780
          
          // Use the event code exactly as is
          const eventCode = notification.relatedId;
              
           if (window.location.pathname === `/events/${eventCode}`) {
             window.location.href = `/events/${eventCode}`;
             return;
           }
          navigate(`/events/${eventCode}`);
        } 
        else if (notification.relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${notification.relatedId}`);
        } 
        else {
          navigate(`/${notification.relatedId}`);
        }
      } else {
        navigate('/notifications');
      }
      
      toast("Notification marked as read");
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast("Could not process notification");
    }
  }, [markAsRead, navigate]);

  const handleNotificationComplete = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsCompleted(notification.id);
      toast("Task marked as complete");
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      toast("Could not complete notification");
    }
  }, [markAsCompleted]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      toast("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast("Could not mark all notifications as read");
    }
  }, [markAllAsRead]);

  const handleViewAllNotifications = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/notifications');
  }, [navigate]);

  // Get limited notifications for dashboard display
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
