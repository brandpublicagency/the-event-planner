
import { useNotificationState } from './useNotificationState';
import { useNotificationFetch } from './useNotificationFetch';
import { useNotificationSubscription } from './useNotificationSubscription';
import { useNotificationActionHandlers } from './useNotificationActionHandlers';
import { useRef, useEffect } from 'react';

export function useNotificationSystem() {
  // Initialize state
  const state = useNotificationState();
  
  // Track if this is the first mount
  const isFirstMount = useRef(true);
  
  // Initialize fetch functionality
  const { fetchNotifications } = useNotificationFetch(state);
  
  // Initialize subscription and refresh functionality
  const { 
    refreshNotifications, 
    debouncedFetch, 
    triggerNotificationProcessing 
  } = useNotificationSubscription(state, fetchNotifications);
  
  // Initialize action handlers
  const { 
    markAsRead, 
    markAsCompleted 
  } = useNotificationActionHandlers(state, debouncedFetch);

  // Only perform initial fetch once on first mount
  useEffect(() => {
    if (isFirstMount.current) {
      console.log('First mount in useNotificationSystem - setting up initial fetch');
      isFirstMount.current = false;
      
      // Delay the initial fetch to prevent race conditions during navigation
      const timer = setTimeout(() => {
        if (state.isMounted.current && !state.hasAttemptedFetch) {
          console.log('Performing delayed initial fetch in useNotificationSystem');
          fetchNotifications().catch(err => {
            console.error('Initial fetch failed:', err);
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [fetchNotifications, state.hasAttemptedFetch]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    pendingNotifications: state.pendingNotifications,
    hasAttemptedFetch: state.hasAttemptedFetch,
    
    // Actions
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    
    // Additional
    fetchNotifications
  };
}
