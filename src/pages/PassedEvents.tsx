
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/events/EventsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";
import { groupEventsByMonth, deleteEvent } from "@/utils/eventUtils";
import { Header } from "@/components/layout/Header";

const PassedEvents = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['passed-events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .is('deleted_at', null)
        .or(`completed.eq.true,event_date.lt.${today.toISOString().split('T')[0]}`)
        .order('event_date', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch passed events",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched passed events:', data);
      return data as Event[];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
      <Header
        showBackButton
        backButtonPath="/events"
        pageTitle="Passed Events"
      />
      
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
