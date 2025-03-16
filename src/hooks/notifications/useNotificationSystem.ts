
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchNotificationData } from '@/api/notificationApi';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationProcessing } from './useNotificationProcessing';

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  // Use separate hooks for specialized functionality
  // Create a setNotifications function to pass to useNotificationActions
  const { markAsRead, markAsCompleted } = useNotificationActions(setPendingNotifications);
  const { triggerNotificationProcessing } = useNotificationProcessing();

  // Fetch notifications from the database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const formattedNotifications = await fetchNotificationData();
      setPendingNotifications(formattedNotifications);
    } catch (err) {
      console.error('Error in notification system:', err);
      toast({
        title: 'Error loading notifications',
        description: 'There was a problem fetching your notifications.',
        variant: 'destructive',
      });
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
    fetchNotifications();
    
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
          console.log('Notification updated:', payload);
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchNotifications]);

  return {
    loading,
    pendingNotifications,
    markAsRead: handleMarkAsRead,
    markAsCompleted: handleMarkAsCompleted,
    refreshNotifications: fetchNotifications,
    triggerNotificationProcessing
  };
}
