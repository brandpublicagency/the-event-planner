
import { useCallback } from 'react';
import { Notification } from '@/types/notification';
import { useNotificationSystem } from './useNotificationSystem';
import { useTabState } from './useTabState';
import { useNotificationPageActions } from './useNotificationPageActions';
import { useNotificationProcessingActions } from './useNotificationProcessingActions';
import { useNotificationPageState } from './useNotificationPageState';

export function useNotificationsPage() {
  // Fix the destructuring - useTabState returns an object, not an array
  const tabState = useTabState();
  const activeTab = tabState.activeTab;
  const setActiveTab = tabState.handleTabChange;
  
  const {
    pendingNotifications,
    loading: systemLoading,
    error: systemError,
    hasAttemptedFetch,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  } = useNotificationSystem();
  
  // Use our new hooks for state and actions
  const {
    notifications,
    loading,
    error,
    isActionLoading, 
    setIsActionLoading,
    setError
  } = useNotificationPageState(systemLoading, systemError, pendingNotifications);

  // Create a wrapper for markAllRead that processes all notifications
  const handleMarkAllRead = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      await Promise.all(
        pendingNotifications
          .filter(n => !n.read)
          .map(n => markAsRead(n.id))
      );
      setIsActionLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      setError(error instanceof Error ? error : new Error('Failed to mark notifications as read'));
      setIsActionLoading(false);
      return Promise.reject(error);
    }
  }, [pendingNotifications, markAsRead, setIsActionLoading, setError]);

  // Use notification page actions
  const {
    handleViewEvent,
    handleCompleteTask,
    handleRefresh: baseHandleRefresh
  } = useNotificationPageActions(markAsRead, markAsCompleted, refreshNotifications);

  // Wrap handleRefresh to manage loading state
  const handleRefresh = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      await baseHandleRefresh();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to refresh notifications'));
    } finally {
      setIsActionLoading(false);
    }
  }, [baseHandleRefresh, setIsActionLoading, setError]);

  // Use notification processing actions
  const {
    handleTriggerProcess: baseTriggerProcess,
    handleManualNotificationCheck: baseManualCheck,
  } = useNotificationProcessingActions(triggerNotificationProcessing, refreshNotifications);

  // Wrap processing functions to manage loading state
  const handleTriggerProcess = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      await baseTriggerProcess();
    } catch (error) {
      console.error('Error triggering notification process:', error);
      setError(error instanceof Error ? error : new Error('Failed to process notifications'));
    } finally {
      setIsActionLoading(false);
    }
  }, [baseTriggerProcess, setIsActionLoading, setError]);

  const handleManualNotificationCheck = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      await baseManualCheck();
    } catch (error) {
      console.error('Error checking for missing notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to check for missing notifications'));
    } finally {
      setIsActionLoading(false);
    }
  }, [baseManualCheck, setIsActionLoading, setError]);

  return {
    activeTab,
    setActiveTab,
    notifications,
    loading,
    error,
    hasAttemptedFetch,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess,
    handleManualNotificationCheck
  };
}
