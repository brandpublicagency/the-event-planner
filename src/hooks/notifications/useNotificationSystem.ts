
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchNotificationData } from '@/api/notificationApi';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationProcessing } from './useNotificationProcessing';

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const { toast } = useToast();
  
  // Use the combined useNotificationActions hook
  const { markAsRead, markAsCompleted } = useNotificationActions();
  const { triggerNotificationProcessing } = useNotificationProcessing();

  // Fetch notifications from the database - this is the SINGLE SOURCE OF TRUTH
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('Fetching notifications in useNotificationSystem...');
      setLoading(true);
      setError(null);
      const formattedNotifications = await fetchNotificationData();
      console.log('Notifications fetched in useNotificationSystem:', formattedNotifications.length);
      setPendingNotifications(formattedNotifications);
      setHasAttemptedFetch(true);
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
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return Promise.reject(error);
    }
  }, [markAsRead]);

  // Override markAsCompleted to update local state
  const handleMarkAsCompleted = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      setPendingNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      return Promise.resolve();
    } catch (error) {
      console.error('Error marking notification as completed:', error);
      return Promise.reject(error);
    }
  }, [markAsCompleted]);

  // Load notifications on component mount
  useEffect(() => {
    console.log('Initial fetch in useNotificationSystem');
    fetchNotifications().catch(err => {
      console.error('Failed to fetch notifications in initial load:', err);
    });
    
    // Trigger processing to clean up any duplicates
    triggerNotificationProcessing()
      .then(() => {
        console.log('Triggered notification processing to clean up duplicates');
        // After processing, refresh notifications to get the latest state
        return fetchNotifications();
      })
      .catch(err => {
        console.error('Failed to process notifications:', err);
      });
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('event_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'event_notifications',
          filter: 'sent_at=not.is.null',
        },
        (payload) => {
          console.log('Notification updated in real-time:', payload);
          fetchNotifications().catch(err => {
            console.error('Failed to fetch notifications after update:', err);
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchNotifications, triggerNotificationProcessing]);

  return {
    loading,
    error,
    pendingNotifications,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications: fetchNotifications,
    triggerNotificationProcessing,
    hasAttemptedFetch
  };
}

