
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { triggerNotificationProcessing } from '@/api/notificationApi';

// Track last processing time to prevent excessive API calls
const lastProcessingTime = { timestamp: 0 };
const PROCESSING_COOLDOWN = 300000; // 5 minute cooldown between processing calls
const DEBOUNCE_DELAY = 1000; // 1 second debounce

export function useNotificationSubscription(
  state: ReturnType<typeof import('./useNotificationState').useNotificationState>,
  fetchNotifications: () => Promise<any>
) {
  const { isMounted } = state;
  const channelRef = useRef<any>(null);
  const fetchLock = useRef(false);
  
  // Create a debounced version of fetchNotifications with a longer delay
  const debouncedFetch = useCallback(
    debounce(() => {
      if (!isMounted.current || fetchLock.current) return;
      
      fetchLock.current = true;
      console.log('Running debounced fetch...');
      
      fetchNotifications()
        .catch(err => {
          console.error('Error in debounced fetch:', err);
        })
        .finally(() => {
          fetchLock.current = false;
        });
    }, DEBOUNCE_DELAY),
    [fetchNotifications, isMounted]
  );

  // Trigger notification processing and then fetch the latest
  const refreshNotifications = useCallback(async () => {
    try {
      if (!isMounted.current || fetchLock.current) {
        console.log('Skipping refresh - component not mounted or fetch in progress');
        return [];
      }
      
      fetchLock.current = true;
      state.setLoading(true);
      
      // Check cooldown before triggering processing
      const now = Date.now();
      const shouldProcessNotifications = now - lastProcessingTime.timestamp > PROCESSING_COOLDOWN;
      
      if (shouldProcessNotifications) {
        console.log('Refreshing notifications with processing...');
        // Update timestamp
        lastProcessingTime.timestamp = now;
        
        // First trigger notification processing
        await triggerNotificationProcessing().catch(err => {
          console.log('Notification processing failed, continuing with fetch:', err);
        });
      } else {
        console.log('Skipping notification processing (cooldown active), fetching directly...');
      }
      
      // Then fetch the latest notifications
      return await fetchNotifications();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
      throw err;
    } finally {
      if (isMounted.current) {
        state.setLoading(false);
      }
      fetchLock.current = false;
    }
  }, [fetchNotifications, state, isMounted]);

  // Set up subscription and cleanup
  useEffect(() => {
    console.log('Setting up notification subscription');
    isMounted.current = true;
    
    // Set up real-time subscription for notifications
    if (!channelRef.current) {
      channelRef.current = supabase
        .channel('event_notifications_channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'event_notifications',
          },
          (payload) => {
            console.log('New notification detected:', payload);
            // Use debounce to prevent multiple fetches for batch updates
            if (isMounted.current && !fetchLock.current) {
              debouncedFetch();
            }
          }
        )
        .subscribe();
    }
    
    // Clean up subscription and abort any in-flight requests on unmount
    return () => {
      console.log('Cleaning up useNotificationSubscription');
      isMounted.current = false;
      debouncedFetch.cancel();
      
      if (state.abortControllerRef.current) {
        try {
          state.abortControllerRef.current.abort();
        } catch (e) {
          console.error('Error aborting fetch request:', e);
        }
      }
      
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        } catch (e) {
          console.error('Error removing supabase channel:', e);
        }
      }
    };
  }, [state.abortControllerRef, debouncedFetch]);

  return {
    refreshNotifications,
    debouncedFetch,
    triggerNotificationProcessing
  };
}
