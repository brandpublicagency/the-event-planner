
import { useNotifications } from '@/contexts/NotificationContext';
import { useScheduledNotifications } from '@/contexts/ScheduledNotificationContext';
import { useNotificationHandlers } from './useNotificationHandlers';
import { useMemo } from 'react';

/**
 * Main hook for the Notifications page that combines all notification functionality
 */
export function useNotificationsPage() {
  // General notifications
  const { notifications: generalNotifications, markAsRead, markAllAsRead } = useNotifications();
  
  // Scheduled/reminder notifications
  const { 
    notifications: scheduledNotifications, 
    markAsRead: markScheduledAsRead, 
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    loading: scheduledLoading
  } = useScheduledNotifications();
  
  // Combine all notifications
  const allNotifications = useMemo(() => {
    return [...generalNotifications, ...scheduledNotifications]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [generalNotifications, scheduledNotifications]);
  
  // Handlers for notification interactions
  const {
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  } = useNotificationHandlers(
    markAsRead,
    markAllAsRead,
    markScheduledAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  );

  return {
    // State
    notifications: allNotifications,
    loading: scheduledLoading,
    
    // Handlers
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  };
}
