
import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';
import { navigateToNotificationTarget } from '@/utils/notificationNavigation';

export type FilterType = 'all' | 'unread' | 'read';

export const useNotificationPage = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    unreadCount,
    error,
    lastFilterRefresh
  } = useNotifications();
  
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'unread') return !notification.read;
      if (currentFilter === 'read') return notification.read;
      return true;
    });
  }, [notifications, currentFilter, lastFilterRefresh]);

  const handleRefresh = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRefreshing(true);
    try {
      const success = await refreshNotifications();
      if (success) {
        toast.success('Notifications refreshed successfully');
      } else {
        toast.warning('Notifications may not be up to date');
      }
    } catch (error) {
      toast.error('Failed to refresh notifications');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [refreshNotifications]);

  const handleViewDetail = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await markAsRead(notification.id);
      
      if (success) {
        toast.success("Notification marked as read");
        navigateToNotificationTarget(notification, navigate);
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (error) {
      toast.error("Failed to process notification");
    }
  }, [markAsRead, navigate]);

  const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await markAllAsRead();
      
      if (success) {
        toast.success("All notifications marked as read");
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  }, [markAllAsRead]);

  const handleCompleteTask = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await markAsCompleted(notification.id);
      
      if (success) {
        toast.success("Task marked as complete");
      } else {
        toast.error("Failed to mark task as complete");
      }
    } catch (error) {
      toast.error("Failed to mark task as complete");
    }
  }, [markAsCompleted]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
  }, []);

  return {
    notifications,
    filteredNotifications,
    loading,
    isRefreshing,
    unreadCount,
    error,
    currentFilter,
    handleRefresh,
    handleViewDetail,
    handleMarkAllAsRead,
    handleCompleteTask,
    handleFilterChange
  };
};
