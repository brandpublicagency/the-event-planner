
import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchNotificationData, triggerNotificationProcessing } from '@/api/notificationApi';
import { useNotificationActions } from './useNotificationActions';
import { debounce } from 'lodash';

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const { toast } = useToast();
  
  // Use refs to maintain state between renders and cancel stale requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef<number>(0);
  const isMounted = useRef(true);
  const lastFetchTime = useRef<number>(0);
  
  // Use the notification actions hook
  const { markAsRead, markAsCompleted } = useNotificationActions();

  // Debounce fetch to prevent multiple calls in rapid succession
  const debouncedFetch = useRef(
    debounce(async () => {
      if (!isMounted.current) return;
      await fetchNotifications();
    }, 300)
  ).current;

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
  }, [toast]);

  // Trigger notification processing and then fetch the latest
  const refreshNotifications = useCallback(async () => {
    try {
      console.log('Refreshing notifications with processing...');
      if (!isMounted.current) return [];
      
      setLoading(true);
      
      // First trigger notification processing
      await triggerNotificationProcessing().catch(err => {
        console.log('Notification processing failed, continuing with fetch:', err);
      });
      
      // Then fetch the latest notifications
      return await fetchNotifications();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchNotifications]);

  // Override markAsRead to update local state with optimistic updates
  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      // Optimistic update
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          )
        );
      }
      
      const result = await markAsRead(id);
      
      // If the operation failed, revert the optimistic update
      if (!result && isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id && notification.read
              ? { ...notification, read: false } 
              : notification
          )
        );
        
        toast({
          title: 'Failed to mark as read',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Revert optimistic update on error
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.map(notification => 
            notification.id === id && notification.read
              ? { ...notification, read: false } 
              : notification
          )
        );
      }
      
      throw error;
    }
  }, [markAsRead, toast]);

  // Override markAsCompleted to update local state with optimistic updates
  const handleMarkAsCompleted = useCallback(async (id: string) => {
    try {
      // Optimistic update - remove from local state
      if (isMounted.current) {
        setPendingNotifications(prev => 
          prev.filter(notification => notification.id !== id)
        );
      }
      
      const result = await markAsCompleted(id);
      
      // If the operation failed, revert the optimistic update by fetching fresh data
      if (!result) {
        console.warn('Failed to mark notification as completed, refreshing data');
        if (isMounted.current) {
          debouncedFetch();
          toast({
            title: 'Failed to complete notification',
            description: 'Please try again.',
            variant: 'destructive',
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      
      // Revert optimistic update on error by fetching fresh data
      if (isMounted.current) {
        debouncedFetch();
      }
      
      throw error;
    }
  }, [markAsCompleted, toast, debouncedFetch]);

  // Load notifications on component mount and set up real-time subscription
  useEffect(() => {
    console.log('Initial notification fetch in useNotificationSystem');
    isMounted.current = true;
    
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
      
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
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
  }, [fetchNotifications, debouncedFetch]);

  return {
    loading,
    error,
    pendingNotifications,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing, // Add this to the returned object
    hasAttemptedFetch
  };
}
