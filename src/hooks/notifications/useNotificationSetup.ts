
import { useEffect, useRef } from "react";

export function useNotificationSetup(
  error: Error | null,
  isSubscribed: boolean,
  refreshNotifications: () => Promise<void>,
  isMounted: React.MutableRefObject<boolean>,
  refreshIntervalRef: React.MutableRefObject<number | null>,
  toast: any
) {
  // Track if we've already shown the error toast
  const hasShownErrorToast = useRef(false);
  // Track if we've already shown the subscription warning
  const hasShownSubWarning = useRef(false);

  // Display error toast if there's an error from the notification system
  useEffect(() => {
    if (error && isMounted.current && !hasShownErrorToast.current) {
      toast({
        title: 'Notification System Error',
        description: error.message || 'Failed to load notifications',
        variant: 'destructive',
      });
      // Remember we've shown this error
      hasShownErrorToast.current = true;
    }
  }, [error, toast, isMounted]);
  
  // Don't show warning about real-time updates - disable this feature
  // Users will still get periodic refreshes from the interval

  // Set up periodic refresh and cleanup properly
  useEffect(() => {
    isMounted.current = true;
    
    // Refresh notifications when component mounts
    refreshNotifications().catch(err => {
      if (isMounted.current) {
        console.error('Failed to refresh notifications on mount:', err);
      }
    });
    
    // Set up a periodic refresh every 2 minutes (reduced from 5 minutes)
    refreshIntervalRef.current = window.setInterval(() => {
      if (isMounted.current) {
        console.log('Periodic notification refresh');
        refreshNotifications().catch(err => {
          if (isMounted.current) {
            console.error('Failed to refresh notifications on interval:', err);
          }
        });
      }
    }, 120000); // 2 minutes
    
    // Clean up the interval on unmount
    return () => {
      isMounted.current = false;
      if (refreshIntervalRef.current !== null) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [refreshNotifications, isMounted, refreshIntervalRef]);
}
