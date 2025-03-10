
import React, { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/types/event";
import { useQueryClient } from "@tanstack/react-query";

interface SyncEventButtonProps {
  event: Event;
  className?: string;
}

export const SyncEventButton: React.FC<SyncEventButtonProps> = ({ event, className }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSyncing(true);

    try {
      // Call the edge function to sync the event with Google Calendar
      const { data, error } = await supabase.functions.invoke('sync-event-to-calendar', {
        body: { event }
      });
      
      if (error) throw error;
      
      toast({
        title: "Event Synced",
        description: "Event has been synced to Cal.com/Google Calendar"
      });

      // Invalidate relevant queries to refresh the UI
      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        queryClient.invalidateQueries({ 
          queryKey: ['events', eventDate.getMonth(), eventDate.getFullYear()]
        });
      }
    } catch (error) {
      console.error('Error syncing event to calendar:', error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync event to calendar. Make sure you've connected your calendar first."
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className={className}
    >
      <CalendarPlus className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      <span className="sr-only">Sync to Calendar</span>
    </Button>
  );
};
