
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";

export function useEventNotifications(
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) {
  const { toast } = useToast();

  // Subscribe to new events
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
            type: "event_created" as NotificationType,
            read: false,
            actionType: "review" as const,
            relatedId: newEvent.event_code
          };
          
          // Check for duplicates before adding
          setNotifications(prev => {
            // Don't add duplicate notifications
            if (prev.some(n => n.id === notificationId)) {
              console.log('Duplicate notification, not adding:', notificationId);
              return prev;
            }
            
            console.log('Adding new notification:', newNotification);
            return [...prev, newNotification];
          });
          
          // Also show a toast notification
          toast({
            title: "New Event Created",
            description: `Event "${newEvent.name}" has been added`,
            variant: "success",
            showProgress: true,
            duration: 7000
          });
        }
      )
      .subscribe((status) => {
        console.log('Event notification subscription status:', status);
      });
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up event notification subscription');
      supabase.removeChannel(channel);
    };
  }, [toast, setNotifications]);

  // Also, let's fetch any new events added in the last 24 hours to show as notifications
  useEffect(() => {
    const fetchRecentEvents = async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data, error } = await supabase
        .from('events')
        .select('event_code, name, created_at')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching recent events:', error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Found recent events:', data);
        
        // Add each recent event as a notification if it doesn't exist already
        setNotifications(prev => {
          const newNotifications = data
            .filter(event => !prev.some(n => n.relatedId === event.event_code && n.type === 'event_created'))
            .map(event => ({
              id: `event-created-${event.event_code}-${Date.now()}`,
              title: "New Event Created",
              description: `New event "${event.name}" has been created`,
              createdAt: new Date(event.created_at),
              type: "event_created" as NotificationType,
              read: false,
              actionType: "review" as const,
              relatedId: event.event_code
            }));
            
          if (newNotifications.length === 0) {
            return prev;
          }
          
          console.log('Adding notifications for recent events:', newNotifications);
          return [...prev, ...newNotifications];
        });
      }
    };
    
    fetchRecentEvents();
  }, [setNotifications]);
}
