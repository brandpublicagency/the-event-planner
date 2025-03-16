
import { useNotifications } from '@/contexts/NotificationContext';
import { useScheduledNotifications } from '@/contexts/ScheduledNotificationContext';
import { useTabState } from './useTabState';
import { useNotificationHandlers } from './useNotificationHandlers';

/**
 * Main hook for the Notifications page that combines all notification functionality
 */
export function useNotificationsPage() {
  // General notifications
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  // Scheduled/reminder notifications
  const { 
    notifications: scheduledNotifications, 
    markAsRead: markScheduledAsRead, 
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    loading
  } = useScheduledNotifications();
  
  // Tab state management
  const { activeTab, handleTabChange } = useTabState();
  
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
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  );

  return {
    // State
    activeTab,
    notifications,
    scheduledNotifications,
    loading,
    
    // Handlers
    handleTabChange,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  };
}
