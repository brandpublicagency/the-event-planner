
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRealTimeNotifications() {
  const { toast } = useToast();

  // Set up real-time subscription for new notifications
  useEffect(() => {
    console.log('Setting up scheduled notification subscription');
    
    // Subscribe to event_notifications table for real-time updates
    const channel = supabase
      .channel('scheduled-notifications')
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
            console.log('New notification sent:', payload);
            
            // Show more prominent toast with long duration
            toast({
              title: "Important Notification",
              description: "You have a new notification that requires attention",
              variant: "default",
              showProgress: true,
              duration: 10000 // 10 seconds for more visibility
            });
            
            // Also trigger browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Notification', {
                body: 'You have a new notification that requires attention',
                icon: '/favicon.ico'
              });
            } else if ('Notification' in window && Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Notification subscription status:', status);
      });
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  }, [toast]);
}
