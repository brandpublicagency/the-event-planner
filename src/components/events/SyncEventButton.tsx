
import React, { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/types/event";

interface SyncEventButtonProps {
  event: Event;
  className?: string;
}

export const SyncEventButton: React.FC<SyncEventButtonProps> = ({ event, className }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSyncing(true);

    try {
      // Here we would call a backend function to sync the event with Google Calendar
      // For now, show a toast explaining the feature is coming soon
      toast({
        title: "Coming Soon",
        description: "Event syncing with Google Calendar will be available soon!"
      });
      
      // Future implementation:
      // const { data, error } = await supabase.functions.invoke('sync-event-to-calendar', {
      //   body: { eventCode: event.event_code }
      // });
      //
      // if (error) throw error;
      //
      // toast({
      //   title: "Event Synced",
      //   description: "Event has been added to your Google Calendar"
      // });
    } catch (error) {
      console.error('Error syncing event to calendar:', error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync event to Google Calendar."
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
      <CalendarPlus className="h-4 w-4" />
      <span className="sr-only">Sync to Calendar</span>
    </Button>
  );
};
