
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRealTimeNotifications() {
  const { toast } = useToast();

  // Set up real-time subscription for new notifications
  useEffect(() => {
    console.log('Setting up real-time notification subscription');
    
    // Subscribe to event_notifications table for real-time updates
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
              duration: 5000
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
          });
        }
      )
      .subscribe((status) => {
        console.log('Notification insert subscription status:', status);
      });
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
      supabase.removeChannel(insertChannel);
    };
  }, [toast]);
}
