
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
  const { markAsRead, markAsCompleted } = useNotificationActions();
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
    const success = await markAsRead(id);
    
    if (success) {
      setPendingNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    }
  }, [markAsRead]);

  // Override markAsCompleted to update local state
  const handleMarkAsCompleted = useCallback(async (id: string) => {
    const success = await markAsCompleted(id);
    
    if (success) {
      setPendingNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
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
