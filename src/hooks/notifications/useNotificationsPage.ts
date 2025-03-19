
import { useCallback, useEffect, useState, useRef } from 'react';
import { useNotificationSystem } from './useNotificationSystem';
import { useTabState } from './useTabState';
import { useNotificationPageActions } from './useNotificationPageActions';
import { useNotificationPageState } from './useNotificationPageState';

export function useNotificationsPage() {
  // Get the tab state
  const tabState = useTabState();
  const activeTab = tabState.activeTab;
  const setActiveTab = tabState.handleTabChange;
  
  // Track if we're currently navigating or loading
  const isInitialLoadRef = useRef(true);
  
  // Get notification data from the centralized system
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
  
  // Log what we get from the system
  console.log('useNotificationsPage - received notifications from system:', 
    pendingNotifications?.length, 'loading:', systemLoading);
  
  // Use our state management hook
  const {
    notifications,
    loading,
    error,
    isActionLoading, 
    setIsActionLoading,
    setError
  } = useNotificationPageState(systemLoading, systemError, pendingNotifications);

  // Use notification page actions
  const {
    handleViewEvent,
    handleCompleteTask,
    handleRefresh: baseHandleRefresh
  } = useNotificationPageActions(markAsRead, markAsCompleted, refreshNotifications);

  // Wrap handleRefresh to manage loading state
  const handleRefresh = useCallback(async () => {
    // Don't trigger multiple refreshes simultaneously
    if (isActionLoading) {
      console.log('Skipping refresh as another action is already in progress');
      return;
    }
    
    console.log('Refreshing notifications from page...');
    setIsActionLoading(true);
    setError(null);
    
    try {
      await baseHandleRefresh();
      isInitialLoadRef.current = false;
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to refresh notifications'));
    } finally {
      setIsActionLoading(false);
    }
  }, [baseHandleRefresh, setIsActionLoading, setError, isActionLoading]);

  // Only attempt a fetch if we've never loaded data and we're not currently loading
  useEffect(() => {
    if (isInitialLoadRef.current && !hasAttemptedFetch && !systemLoading && !isActionLoading) {
      console.log('Initial load in useNotificationsPage - deferring to page component');
      isInitialLoadRef.current = false;
    }
  }, [hasAttemptedFetch, systemLoading, isActionLoading]);

  return {
    activeTab,
    setActiveTab,
    notifications,
    loading,
    error,
    hasAttemptedFetch,
    handleViewEvent,
    handleCompleteTask,
    handleRefresh,
    triggerNotificationProcessing
  };
}
