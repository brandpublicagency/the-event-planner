
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Fetch notifications from the database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      // Query event notifications and join with templates to get details
      const { data, error } = await supabase
        .from('event_notifications')
        .select(`
          id,
          event_code,
          notification_type,
          scheduled_for,
          sent_at,
          is_read,
          is_completed,
          created_at,
          events:events!inner(name, event_type, primary_name),
          templates:notification_templates!inner(title, description_template, action_type)
        `)
        .is('is_read', false)
        .not('sent_at', 'is', null)
        .order('scheduled_for', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error loading notifications',
          description: 'There was a problem fetching your notifications.',
          variant: 'destructive',
        });
        return;
      }

      // Transform data to match Notification type
      const formattedNotifications: Notification[] = data?.map(item => {
        // Process template with event data
        let description = item.templates.description_template;
        description = description.replace('{event_name}', item.events.name || 'Untitled Event');
        description = description.replace('{event_type}', item.events.event_type || 'Event');
        description = description.replace('{primary_contact}', item.events.primary_name || 'Client');

        return {
          id: item.id,
          title: item.templates.title,
          description: description,
          createdAt: new Date(item.sent_at || item.created_at),
          type: item.notification_type as any,
          read: item.is_read,
          actionType: item.templates.action_type as any,
          relatedId: item.event_code
        };
      }) || [];

      setPendingNotifications(formattedNotifications);
    } catch (err) {
      console.error('Error in notification system:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setPendingNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark a notification as completed
  const markAsCompleted = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_notifications')
        .update({ 
          is_completed: true, 
          is_read: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as completed:', error);
        return;
      }

      setPendingNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );

      toast({
        title: 'Task completed',
        description: 'The notification has been marked as completed.',
        variant: 'success',
      });
    } catch (err) {
      console.error('Error marking notification as completed:', err);
    }
  }, [toast]);

  // Trigger manual notification processing (primarily for testing)
  const triggerNotificationProcessing = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('trigger-notifications');
      
      if (error) {
        console.error('Error triggering notifications:', error);
        toast({
          title: 'Error processing notifications',
          description: 'There was a problem triggering the notification process.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Notifications processed',
        description: `Processed ${data.processed || 0} notifications.`,
        variant: 'success',
      });
      
      // Refresh notifications after processing
      fetchNotifications();
    } catch (err) {
      console.error('Error triggering notifications:', err);
    }
  }, [fetchNotifications, toast]);

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
    markAsRead,
    markAsCompleted,
    refreshNotifications: fetchNotifications,
    triggerNotificationProcessing
  };
}
