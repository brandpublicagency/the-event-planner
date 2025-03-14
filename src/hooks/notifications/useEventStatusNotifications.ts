
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { addDays } from "date-fns";

export function useEventStatusNotifications(
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) {
  // Check for incomplete events
  useEffect(() => {
    const checkIncompleteEvents = async () => {
      // Get today's date
      const today = new Date();
      
      // Get date 14 days from now
      const futureDate = addDays(today, 14);
      
      try {
        // Fetch upcoming events in the next 14 days
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .gt('event_date', today.toISOString().split('T')[0])
          .lt('event_date', futureDate.toISOString().split('T')[0])
          .is('deleted_at', null); // Only include non-deleted events
          
        if (error) {
          console.error('Error fetching events for notification check:', error);
          return;
        }
        
        // Check for incomplete events
        const incompleteEvents = events?.filter(event => {
          // Check for missing important fields
          return !event.venues?.length || !event.primary_name || !event.pax;
        });
        
        // Create notifications for incomplete events
        if (incompleteEvents?.length) {
          const incompleteNotifications = incompleteEvents.map(event => ({
            id: `event-incomplete-${event.event_code}`,
            title: "Incomplete Event",
            description: `Event "${event.name}" is missing critical information`,
            createdAt: new Date(),
            type: "event_incomplete" as const,
            read: false,
            actionType: "review" as const,
            relatedId: event.event_code
          }));
          
          // Add to notifications list
          setNotifications(prev => {
            const existingIds = prev.map(n => n.id);
            const filteredNew = incompleteNotifications.filter(n => !existingIds.includes(n.id));
            return [...prev, ...filteredNew];
          });
        }
      } catch (err) {
        console.error('Error in checkIncompleteEvents:', err);
      }
    };
    
    // Run once when component mounts
    checkIncompleteEvents();
    
    // Set interval to check every hour
    const interval = setInterval(checkIncompleteEvents, 3600000);
    
    return () => clearInterval(interval);
  }, [setNotifications]);
}
