import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { Loader2, CalendarClock, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "@/services/eventService";
import type { Event } from "@/types/event";
const UpcomingEventsSection = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    data: allEvents = [],
    refetch,
    isLoading: isEventsLoading,
    error: eventsError
  } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      try {
        const {
          data,
          error
        } = await supabase.from('events').select(`*`).eq('completed', false).is('deleted_at', null).gt('event_date', today.toISOString().split('T')[0]).order('event_date', {
          ascending: true
        });
        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }
        console.log('Fetched dashboard events:', data);
        return data || [] as Event[];
      } catch (error) {
        console.error('Dashboard events fetch error:', error);
        throw error;
      }
    },
    retry: 1
  });
  const events = allEvents.slice(0, 10);
  const groupedEvents = groupEventsByMonth(events);
  const handleDeleteEvent = async (eventCode: string) => {
    try {
      await deleteEvent(eventCode);
      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully"
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete event"
      });
    }
  };
  return <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <div className="flex items-center justify-between p-4 py-5 rounded-lg bg-gray-200">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-zinc-700 bg-transparent" />
          <h3 className="text-lg font-medium text-gray-800">Upcoming Events</h3>
        </div>
        <Button onClick={() => navigate('/events/new')} size="sm" variant="outline" className="h-7 text-xs bg-white rounded-md px-2">
          <Plus className="h-4 w-4 mr-1.5" />
          New Event
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-1 bg-transparent">
        {isEventsLoading ? <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div> : events.length === 0 ? <div className="flex items-center justify-center h-40 text-muted-foreground">
            No upcoming events found
          </div> : <EventsTable groupedEvents={groupedEvents} isDashboard={true} handleDelete={handleDeleteEvent} />}
      </div>
    </div>;
};
export default UpcomingEventsSection;