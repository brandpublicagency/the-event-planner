
import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchNotificationData, triggerNotificationProcessing } from '@/api/notificationApi';
import { useNotificationActions } from './useNotificationActions';

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const { toast } = useToast();
  
  // Use a ref to cancel stale requests
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Track the latest fetch request ID to prevent race conditions
  const fetchIdRef = useRef<number>(0);
  
  // Use the notification actions hook
  const { markAsRead, markAsCompleted } = useNotificationActions();

  // Fetch notifications from the database - this is the SINGLE SOURCE OF TRUTH
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('Fetching notifications in useNotificationSystem...');
      
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      // Generate a unique ID for this fetch request
      const thisFetchId = ++fetchIdRef.current;
      
      setLoading(true);
      setError(null);
      
      const formattedNotifications = await fetchNotificationData();
      
      // Check if this is still the latest request
      if (thisFetchId !== fetchIdRef.current) {
        console.log('Ignoring stale fetch response');
        return [];
      }
      
      console.log('Notifications fetched in useNotificationSystem:', formattedNotifications.length);
      setPendingNotifications(formattedNotifications);
      setHasAttemptedFetch(true);
      return formattedNotifications;
    } catch (err) {
      console.error('Error in notification system:', err);
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
      toast({
        title: 'Error loading notifications',
        description: 'There was a problem fetching your notifications.',
        variant: 'destructive',
      });
      // Still mark as attempted even if there was an error
      setHasAttemptedFetch(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Trigger notification processing and then fetch the latest
  const refreshNotifications = useCallback(async () => {
    try {
      console.log('Refreshing notifications with processing...');
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
      setLoading(false);
    }
  }, [fetchNotifications]);

  // Override markAsRead to update local state
  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      setPendingNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, [markAsRead]);

  // Override markAsCompleted to update local state
  const handleMarkAsCompleted = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      setPendingNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      throw error;
    }
  }, [markAsCompleted]);

  // Load notifications on component mount
  useEffect(() => {
    console.log('Initial notification fetch in useNotificationSystem');
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
          console.log('Notification database change detected:', payload);
          fetchNotifications().catch(err => {
            console.error('Failed to fetch notifications after database change:', err);
          });
        }
      )
      .subscribe();
    
    // Clean up subscription and abort any in-flight requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      supabase.removeChannel(subscription);
    };
  }, [fetchNotifications]);

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
