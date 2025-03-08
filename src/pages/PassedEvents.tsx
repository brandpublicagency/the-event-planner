
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/events/EventsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";
import { groupEventsByMonth, deleteEvent } from "@/utils/eventUtils";

const PassedEvents = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['passed-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venues (
              id,
              name
            )
          )
        `)
        .eq('completed', true)
        .order('event_date', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch passed events",
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map(ev => ({
          id: ev.venues?.id,
          name: ev.venues?.name
        })) || []
      })) as Event[];
    },
  });

  const groupedEvents = groupEventsByMonth(events);

  const filteredEvents = Object.entries(groupedEvents).reduce(
    (acc: Record<string, Event[]>, [monthYear, monthEvents]) => {
      const filteredMonthEvents = monthEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.event_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredMonthEvents.length > 0) {
        acc[monthYear] = filteredMonthEvents;
      }
      return acc;
    },
    {}
  );

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Error loading passed events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Passed Events</h2>
        <p className="text-muted-foreground">View and manage completed events</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search passed events..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <EventsTable 
          groupedEvents={filteredEvents}
          handleDelete={async (eventCode: string) => {
            try {
              await deleteEvent(eventCode);

              toast({
                title: "Success",
                description: "Event deleted successfully",
              });

              refetch();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to delete event",
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default PassedEvents;
