
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import { format } from "date-fns";
import type { Event } from "@/types/event";
import { useToast } from "@/components/ui/use-toast";
import { deleteEvent } from "@/services/eventService";
import { Header } from "@/components/layout/Header";

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .eq('completed', false)
        .is('deleted_at', null)
        .gt('event_date', today.toISOString().split('T')[0]) // Changed from gte to gt to exclude today's events that have already passed
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched events:', data);
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });

  const groupedEvents = events?.reduce((acc: Record<string, Event[]>, event) => {
    if (!event.event_date) return acc;
    const monthYear = format(new Date(event.event_date), 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {}) || {};

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load events. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Events" />
      
      <div className="flex-1 p-6 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <EventsTable 
            groupedEvents={groupedEvents} 
            handleDelete={async (eventCode: string) => {
              try {
                await deleteEvent(eventCode);
                toast({
                  title: "Event deleted",
                  description: "Event has been deleted successfully",
                });
                refetch();
              } catch (error: any) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message || "Failed to delete event",
                });
              }
            }}
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}
