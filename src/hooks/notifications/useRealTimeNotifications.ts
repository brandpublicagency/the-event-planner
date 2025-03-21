
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Set up Supabase realtime subscription
  useEffect(() => {
    console.log('Setting up event notification subscription');
    
    // Subscribe to events table for real-time notifications
    const channel = supabase
      .channel('event-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('New event detected:', payload);
          
          if (!payload.new) {
            console.error('Payload missing new event data');
            return;
          }
          
          // Add new event notification
          const newEvent = payload.new;
          const notificationId = `event-created-${newEvent.event_code}-${Date.now()}`;
          
          console.log('Creating notification with ID:', notificationId);
          
          const newNotification = {
            id: notificationId,
            title: "New Event Created",
            description: `New event "${newEvent.name}" has been created`,
            createdAt: new Date(),
            type: "event_created",
            read: false,
            actionType: "review",
            relatedId: newEvent.event_code
          };
          
          // Show a toast notification
          toast("New Event Created", {
            description: `Event "${newEvent.name}" has been added`,
          });
        }
      )
      .subscribe(status => {
        console.log('Supabase subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up event notification subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { isSubscribed };
}
