
import { useEffect, useRef, useCallback } from "react";

// Use WeakMap to track which errors have been shown
const shownErrorsMap = new WeakMap();

export function useNotificationSetup(
  error: Error | null,
  isSubscribed: boolean,
  refreshNotifications: () => Promise<void>,
  isMounted: React.MutableRefObject<boolean>,
  refreshIntervalRef: React.MutableRefObject<number | null>,
  toast: any
) {
  // Track if we've already shown the error toast for this specific error instance
  const hasShownErrorToast = useRef(false);
  const lastRefreshTime = useRef<number>(0);
  const MIN_REFRESH_INTERVAL = 5000; // 5 seconds
  const refreshLock = useRef(false);
  
  // Safe refresh function that respects mount state and prevents rapid calls
  const safeRefresh = useCallback(async () => {
    if (!isMounted.current || refreshLock.current) {
      console.log('Skipping safe refresh - component not mounted or refresh in progress');
      return;
    }
    
    const now = Date.now();
    if (now - lastRefreshTime.current < MIN_REFRESH_INTERVAL) {
      console.log('Skipping refresh, too soon after last refresh');
      return;
    }
    
    lastRefreshTime.current = now;
    refreshLock.current = true;
    
    try {
      console.log('Performing safe notification refresh');
      await refreshNotifications();
    } catch (err) {
      if (isMounted.current) {
        console.error('Failed to refresh notifications:', err);
      }
    } finally {
      refreshLock.current = false;
    }
  }, [refreshNotifications, isMounted]);
  
  // Display error toast if there's an error from the notification system
  // But only show it once per error instance
  useEffect(() => {
    if (error && isMounted.current && !hasShownErrorToast.current) {
      try {
        // Check if we've already shown this exact error message
        const errorKey = error.message || 'unknown-error';
        const shownErrors = shownErrorsMap.get(error) || new Set();
        
        if (!shownErrors.has(errorKey)) {
          console.log('Showing notification error toast:', errorKey);
          toast({
            title: 'Notification System',
            description: error.message || 'Failed to load notifications',
            variant: 'destructive',
          });
          
          // Remember we've shown this error
          shownErrors.add(errorKey);
          shownErrorsMap.set(error, shownErrors);
          hasShownErrorToast.current = true;
        }
      } catch (err) {
        console.error('Error showing notification error toast:', err);
      }
    }
  }, [error, toast, isMounted]);
  
  // Set up periodic refresh with proper cleanup
  useEffect(() => {
    if (refreshIntervalRef.current !== null) {
      // Interval already set up by another instance
      return () => {};
    }
    
    isMounted.current = true;
    
    // Refresh notifications when component mounts (only if no refresh is in progress)
    if (!refreshLock.current) {
      console.log('Initial notification refresh in setup');
      safeRefresh();
    }
    
    // Set up a periodic refresh every 5 minutes
    console.log('Setting up periodic notification refresh interval');
    refreshIntervalRef.current = window.setInterval(() => {
      if (isMounted.current && !refreshLock.current) {
        console.log('Periodic notification refresh');
        safeRefresh();
      }
    }, 300000); // 5 minutes
    
    // Clean up the interval on unmount
    return () => {
      isMounted.current = false;
      if (refreshIntervalRef.current !== null) {
        console.log('Cleaning up notification refresh interval');
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [safeRefresh, isMounted, refreshIntervalRef, isSubscribed]);
}
