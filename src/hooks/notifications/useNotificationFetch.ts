
import { useCallback } from 'react';
import { fetchNotificationData } from '@/api/notificationApi';
import { useToast } from '@/hooks/use-toast';

export function useNotificationFetch(state: ReturnType<typeof import('./useNotificationState').useNotificationState>) {
  const { toast } = useToast();
  const {
    setLoading,
    setError,
    setPendingNotifications,
    setHasAttemptedFetch,
    abortControllerRef,
    fetchIdRef,
    isMounted,
    lastFetchTime
  } = state;

  // Fetch notifications from the database - this is the SINGLE SOURCE OF TRUTH
  const fetchNotifications = useCallback(async () => {
    try {
      // Don't fetch if we've fetched recently (within last 2 seconds)
      const now = Date.now();
      if (now - lastFetchTime.current < 2000) {
        console.log('Skipping fetch, last fetch was too recent');
        return [];
      }
      lastFetchTime.current = now;
      
      console.log('Fetching notifications in useNotificationSystem...');
      
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      // Generate a unique ID for this fetch request
      const thisFetchId = ++fetchIdRef.current;
      
      if (!isMounted.current) return [];
      
      setLoading(true);
      setError(null);
      
      // Set timeout for long-running operations
      const timeoutId = setTimeout(() => {
        if (isMounted.current && thisFetchId === fetchIdRef.current) {
          console.log('Fetch timeout reached');
          if (abortControllerRef.current) {
            abortControllerRef.current.abort('timeout');
          }
          
          // Only update UI if this is still the current request
          if (thisFetchId === fetchIdRef.current && isMounted.current) {
            setError(new Error('Request timed out. Please try again.'));
            setLoading(false);
          }
        }
      }, 15000); // 15 second timeout
      
      const formattedNotifications = await fetchNotificationData();
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
      // Check if this is still the latest request and component is mounted
      if (thisFetchId !== fetchIdRef.current || !isMounted.current) {
        console.log('Ignoring stale fetch response');
        return [];
      }
      
      console.log('Notifications fetched in useNotificationSystem:', formattedNotifications.length);
      
      // Validate notifications before setting state
      const validNotifications = formattedNotifications.filter(notification => {
        if (!notification || typeof notification !== 'object') return false;
        if (!notification.id || typeof notification.id !== 'string') return false;
        if (!notification.title || typeof notification.title !== 'string') return false;
        if (!notification.createdAt || !(notification.createdAt instanceof Date)) return false;
        return true;
      });
      
      if (validNotifications.length !== formattedNotifications.length) {
        console.warn(`Filtered out ${formattedNotifications.length - validNotifications.length} invalid notifications`);
      }
      
      if (isMounted.current) {
        setPendingNotifications(validNotifications);
        setHasAttemptedFetch(true);
        setLoading(false);
      }
      
      return validNotifications;
    } catch (err) {
      console.error('Error in notification system:', err);
      
      if (isMounted.current) {
        // Specific error handling
        if (err instanceof Error) {
          if (err.message.includes('timeout')) {
            setError(new Error('The request took too long to complete. Please try again.'));
          } else if (err.message.includes('network')) {
            setError(new Error('Network connection issue. Please check your internet connection.'));
          } else if (err.message.includes('auth') || err.message.includes('401')) {
            setError(new Error('Authentication error. Please sign in again.'));
          } else {
            setError(err);
          }
        } else {
          setError(new Error('Failed to load notifications'));
        }
        
        toast({
          title: 'Error loading notifications',
          description: err instanceof Error ? err.message : 'There was a problem fetching your notifications.',
          variant: 'destructive',
        });
        
        // Still mark as attempted even if there was an error
        setHasAttemptedFetch(true);
        setLoading(false);
      }
      
      throw err;
    }
  }, [toast, setLoading, setError, setPendingNotifications, setHasAttemptedFetch]);

  return {
    fetchNotifications
  };
}
