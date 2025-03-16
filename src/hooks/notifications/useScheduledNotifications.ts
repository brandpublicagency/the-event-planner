
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useScheduledNotifications(
  onNewNotification: () => void
) {
  const { toast } = useToast();

  // Set up real-time subscription for new notifications
  useEffect(() => {
    console.log('Setting up unified notification subscription');
    
    // Subscribe to event_notifications table for real-time updates
    const channel = supabase
      .channel('unified-notifications')
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
            
            // Determine notification type
            const isReminder = payload.new.notification_type?.includes('task');
            
            // Show toast with appropriate styling and text
            toast({
              title: isReminder ? "New Reminder" : "New Notification",
              description: isReminder 
                ? "You have a new task reminder to review" 
                : "You have a new notification to review",
              variant: "info",
              showProgress: true,
              duration: 5000
            });
            
            // Call the callback to refresh notifications
            onNewNotification();
          }
        }
      )
      .subscribe((status) => {
        console.log('Unified notification subscription status:', status);
      });
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up unified notification subscription');
      supabase.removeChannel(channel);
    };
  }, [toast, onNewNotification]);
}
