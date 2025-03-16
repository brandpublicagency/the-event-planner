
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/events/EventsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";
import { groupEventsByMonth, deleteEvent } from "@/utils/eventUtils";
import { Header } from "@/components/layout/Header";
import { format } from "date-fns";
import { Search, CalendarCheck, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PassedEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['passed-events'],
    queryFn: async () => {
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString().split('T')[0];
      
      console.log("Today's ISO date for filtering passed events:", todayIso);
      
      const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .is('deleted_at', null)
        .or(`completed.eq.true,event_date.lt.${todayIso}`)
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
      
      // Log the event with code EVENT-001-113 if it exists
      const specificEvent = data?.find(e => e.event_code === 'EVENT-001-113');
      if (specificEvent) {
        console.log('EVENT-001-113 found in passed events:', specificEvent);
      }
      
      return data as Event[];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Group events by month for display
  const groupedEvents = events.reduce((acc: Record<string, Event[]>, event) => {
    if (!event.event_date) return acc;
    const monthYear = format(new Date(event.event_date), 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {});

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
      
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="h-5 w-5 text-zinc-600" />
            <h2 className="text-lg font-medium">Past Events</h2>
          </div>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-full sm:w-[250px] text-sm"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="text-zinc-700 shrink-0"
              onClick={() => navigate('/events')}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Upcoming Events
            </Button>
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
    </div>
  );
};

export default PassedEvents;
