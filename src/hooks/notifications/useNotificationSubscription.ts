
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { triggerNotificationProcessing } from '@/api/notificationApi';

// Track last processing time to prevent excessive API calls
const lastProcessingTime = { timestamp: 0 };
const PROCESSING_COOLDOWN = 60000; // 1 minute cooldown between processing calls

export function useNotificationSubscription(
  state: ReturnType<typeof import('./useNotificationState').useNotificationState>,
  fetchNotifications: () => Promise<any>
) {
  const { isMounted } = state;

  // Create a debounced version of fetchNotifications
  const debouncedFetch = useCallback(
    debounce(() => {
      if (!isMounted.current) return;
      fetchNotifications().catch(err => {
        console.error('Error in debounced fetch:', err);
      });
    }, 300),
    [fetchNotifications]
  );

  // Trigger notification processing and then fetch the latest
  const refreshNotifications = useCallback(async () => {
    try {
      if (!isMounted.current) return [];
      
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
    }
  }, [fetchNotifications, state]);

  // Set up subscription and cleanup
  useEffect(() => {
    console.log('Setting up notification subscription');
    isMounted.current = true;
    
    // Initial fetch
    fetchNotifications().catch(err => {
      console.error('Failed to fetch notifications in initial load:', err);
    });
    
    // Set up real-time subscription for notifications
    const subscription = supabase
      .channel('event_notifications_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_notifications',
        },
        (payload) => {
          // Validate payload
          if (!payload || !payload.new || typeof payload.new !== 'object') {
            console.error('Invalid real-time payload:', payload);
            return;
          }
          
          console.log('Notification database change detected:', payload);
          
          // Use debounce to prevent multiple fetches for batch updates
          if (isMounted.current) {
            debouncedFetch();
          }
        }
      )
      .subscribe();
    
    // Clean up subscription and abort any in-flight requests on unmount
    return () => {
      console.log('Cleaning up useNotificationSystem');
      isMounted.current = false;
      debouncedFetch.cancel();
      
      if (state.abortControllerRef.current) {
        try {
          state.abortControllerRef.current.abort();
        } catch (e) {
          console.error('Error aborting fetch request:', e);
        }
      }
      
      try {
        supabase.removeChannel(subscription);
      } catch (e) {
        console.error('Error removing supabase channel:', e);
      }
    };
  }, [fetchNotifications, debouncedFetch, state.abortControllerRef]);

  return {
    refreshNotifications,
    debouncedFetch,
    triggerNotificationProcessing
  };
}
