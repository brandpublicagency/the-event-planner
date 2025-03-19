
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useRealTimeNotifications() {
  const { toast } = useToast();
  // Use refs to track subscription channels to prevent memory leaks
  const notificationChannelRef = useRef<RealtimeChannel | null>(null);
  const insertChannelRef = useRef<RealtimeChannel | null>(null);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    console.log('Setting up real-time notification subscription');
    
    // Clean up function to properly remove all channels
    const cleanupSubscriptions = () => {
      console.log('Cleaning up notification subscriptions');
      
      // Clean up notification channel
      if (notificationChannelRef.current) {
        supabase.removeChannel(notificationChannelRef.current);
        notificationChannelRef.current = null;
      }
      
      // Clean up insert channel
      if (insertChannelRef.current) {
        supabase.removeChannel(insertChannelRef.current);
        insertChannelRef.current = null;
      }
    };
    
    // Clean up any existing subscriptions before creating new ones
    cleanupSubscriptions();
    
    // Subscribe to event_notifications table for real-time updates
    try {
      const channel = supabase
        .channel('real-time-notifications')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'event_notifications',
            filter: 'is_read=eq.false',
          },
          (payload) => {
            // Only care about newly sent notifications
            if (payload.new && 
                payload.new.sent_at && 
                (!payload.old || !payload.old.sent_at)) {
              console.log('New notification received:', payload);
              
              // Show toast with notification type indicator
              let title = "New Notification";
              let description = "You have a new notification";
              
              // Customize based on notification type if available
              if (payload.new.notification_type?.includes('task')) {
                title = "Task Reminder";
                description = "You have a new task reminder";
              }
              
              toast({
                title,
                description,
                variant: "info",
                showProgress: true,
                duration: 5000,
                position: "sidebar" // Set position to sidebar
              });
              
              // Also trigger browser notification if supported
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                  body: description,
                  icon: '/favicon.ico'
                });
              } else if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission();
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Real-time notification subscription status:', status);
        });
        
      // Store reference to channel for cleanup
      notificationChannelRef.current = channel;
      
      // Also subscribe to new event_notifications insertions
      const insertChannel = supabase
        .channel('real-time-notifications-insert')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'event_notifications'
          },
          (payload) => {
            console.log('New notification created:', payload);
            
            // Show toast for new notification
            toast({
              title: "New Notification",
              description: "A new notification has been created",
              variant: "default",
              showProgress: true,
              position: "sidebar" // Set position to sidebar
            });
          }
        )
        .subscribe((status) => {
          console.log('Notification insert subscription status:', status);
        });
        
      // Store reference to channel for cleanup
      insertChannelRef.current = insertChannel;
    } catch (error) {
      console.error('Error setting up notification subscriptions:', error);
    }
      
    // Cleanup subscription on unmount
    return cleanupSubscriptions;
  }, [toast]);
}
