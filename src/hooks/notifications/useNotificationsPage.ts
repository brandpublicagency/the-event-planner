
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
  const navigationCompleteRef = useRef(false);
  
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

  // Mark navigation as complete after a delay
  useEffect(() => {
    if (!navigationCompleteRef.current) {
      const timer = setTimeout(() => {
        navigationCompleteRef.current = true;
        console.log('Navigation to notifications page complete');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Only attempt a fetch if navigation is complete and we have not attempted a fetch yet
  useEffect(() => {
    // Skip initial load if we already have notifications
    if (isInitialLoadRef.current && navigationCompleteRef.current && !loading && !isActionLoading) {
      console.log('Initial load in useNotificationsPage after navigation complete');
      
      if (!hasAttemptedFetch || pendingNotifications.length === 0) {
        console.log('No notifications fetched yet, triggering refresh');
        handleRefresh();
      } else {
        console.log('Already have notifications, skipping initial refresh');
      }
      
      isInitialLoadRef.current = false;
    }
  }, [hasAttemptedFetch, loading, isActionLoading, handleRefresh, pendingNotifications.length, navigationCompleteRef]);

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
