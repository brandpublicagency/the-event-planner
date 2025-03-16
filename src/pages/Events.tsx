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
import { CalendarX, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Get today's date at the start of the day in ISO format (YYYY-MM-DD)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .is('deleted_at', null)
        .gte('event_date', todayIso) // Get today's and future events
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
      <Header 
        pageTitle="Events" 
        actionButton={{
          label: "New Event",
          icon: <PlusCircle className="h-4 w-4 mr-2" />,
          onClick: () => navigate('/events/new')
        }}
      />
      
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-5 w-5 text-zinc-600" />
            <h2 className="text-lg font-medium">Upcoming Events</h2>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-zinc-700"
              onClick={() => navigate('/events/passed')}
            >
              <CalendarX className="h-4 w-4 mr-1.5" />
              Past Events
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/events/new')}
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Event
            </Button>
          </div>
        </div>
        
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
