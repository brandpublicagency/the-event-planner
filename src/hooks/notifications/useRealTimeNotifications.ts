
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useRealTimeNotifications() {
  const { toast } = useToast();
  // Use refs to track subscription channels to prevent memory leaks
  const notificationChannelRef = useRef<RealtimeChannel | null>(null);
  const insertChannelRef = useRef<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isMounted = useRef(true);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    console.log('Setting up real-time notification subscription');
    isMounted.current = true;
    
    // Clean up function to properly remove all channels
    const cleanupSubscriptions = () => {
      console.log('Cleaning up notification subscriptions');
      
      // Clean up notification channel
      if (notificationChannelRef.current) {
        try {
          supabase.removeChannel(notificationChannelRef.current);
        } catch (error) {
          console.error('Error removing notification channel:', error);
        }
        notificationChannelRef.current = null;
      }
      
      // Clean up insert channel
      if (insertChannelRef.current) {
        try {
          supabase.removeChannel(insertChannelRef.current);
        } catch (error) {
          console.error('Error removing insert channel:', error);
        }
        insertChannelRef.current = null;
      }
      
      setIsSubscribed(false);
    };
    
    // Clean up any existing subscriptions before creating new ones
    cleanupSubscriptions();
    
    // Add timeout to abort long-running subscription attempts
    const subscriptionTimeout = setTimeout(() => {
      if (!isSubscribed && isMounted.current) {
        console.error('Notification subscription timed out');
        toast({
          title: "Notification System Warning",
          description: "Real-time updates may be delayed. Please refresh if you don't see new notifications.",
          variant: "warning",
          duration: 5000,
        });
      }
    }, 10000); // 10 second timeout
    
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
            // Validate payload data before processing
            if (!payload || !payload.new || typeof payload.new !== 'object') {
              console.error('Invalid notification payload received:', payload);
              return;
            }
            
            // Only care about newly sent notifications
            if (payload.new && 
                payload.new.sent_at && 
                (!payload.old || !payload.old.sent_at)) {
              console.log('New notification received:', payload);
              
              if (!isMounted.current) return; // Prevent state updates after unmount
              
              // Show toast with notification type indicator
              let title = "New Notification";
              let description = "You have a new notification";
              
              // Customize based on notification type if available
              const notificationType = payload.new.notification_type;
              if (notificationType && typeof notificationType === 'string') {
                if (notificationType.includes('task')) {
                  title = "Task Reminder";
                  description = "You have a new task reminder";
                } else if (notificationType.includes('event')) {
                  title = "Event Update";
                  description = "You have an event update";
                } else if (notificationType.includes('document')) {
                  title = "Document Reminder";
                  description = "You have a document reminder";
                }
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
          if (status === 'SUBSCRIBED' && isMounted.current) {
            setIsSubscribed(true);
            clearTimeout(subscriptionTimeout);
          }
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
            // Validate payload
            if (!payload || !payload.new || typeof payload.new !== 'object') {
              console.error('Invalid notification insertion payload:', payload);
              return;
            }
            
            if (!isMounted.current) return; // Prevent state updates after unmount
            
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
        .subscribe();
        
      // Store reference to channel for cleanup
      insertChannelRef.current = insertChannel;
    } catch (error) {
      console.error('Error setting up notification subscriptions:', error);
      if (isMounted.current) {
        toast({
          title: "Notification System Error",
          description: "Failed to set up real-time notifications. You may need to refresh to see new notifications.",
          variant: "destructive",
        });
      }
    }
      
    // Cleanup subscription on unmount
    return () => {
      isMounted.current = false;
      clearTimeout(subscriptionTimeout);
      cleanupSubscriptions();
    };
  }, [toast]);

  return { isSubscribed };
}
