
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/events/EventsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";
import { groupEventsByMonth, deleteEvent } from "@/utils/eventUtils";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react";

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
    <div className="flex flex-col h-full">
      <PageHeader
        contextTitle="Event Management"
        pageTitle="Passed Events"
        subtitle="View and manage completed events"
        showBackButton
        backButtonPath="/events"
      >
        <div className="relative flex-1 mt-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search passed events..." 
            className="pl-10 bg-white border-zinc-200 rounded-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>
      
      <div className="flex-1 p-6">
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
    </div>
  );
};

export default PassedEvents;
