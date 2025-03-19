
import { useNotificationState } from './useNotificationState';
import { useNotificationFetch } from './useNotificationFetch';
import { useNotificationSubscription } from './useNotificationSubscription';
import { useNotificationActionHandlers } from './useNotificationActionHandlers';

export function useNotificationSystem() {
  // Initialize state
  const state = useNotificationState();
  
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
