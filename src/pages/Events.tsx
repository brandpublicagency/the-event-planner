import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import { format } from "date-fns";
import type { Event } from "@/types/event";
import { deleteEvent } from "@/services/eventService";
import { Header } from "@/components/layout/Header";
import { CalendarX, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
export default function Events() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    data: events,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString().split('T')[0];
      console.log("Today's ISO date for filtering:", todayIso);
      console.log("Current date object:", today);
      const {
        data,
        error
      } = await supabase.from('events').select(`*`).is('deleted_at', null).is('completed', false) // Ensure only non-completed events are shown
      .gt('event_date', todayIso) // Changed from gte to gt to exclude today's events
      .order('event_date', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive"
        });
        throw error;
      }
      console.log('Fetched upcoming events:', data);

      // Log the event with code EVENT-001-113 if it exists
      const specificEvent = data?.find(e => e.event_code === 'EVENT-001-113');
      if (specificEvent) {
        console.log('EVENT-001-113 found in upcoming events:', specificEvent);
      } else {
        console.log('EVENT-001-113 NOT found in upcoming events');
      }
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1
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
      position: "sidebar"
    });
  }
  const handleDeleteEvent = async (eventCode: string) => {
    try {
      console.log("Starting deletion of event:", eventCode);

      // Show loading toast
      toast({
        title: "Deleting event...",
        description: "Please wait while the event is being deleted.",
        showProgress: true,
        duration: 10000,
        position: "sidebar"
      });
      await deleteEvent(eventCode);

      // Success toast
      toast({
        title: "Event deleted",
        description: "Event has been successfully deleted",
        variant: "success",
        showProgress: true,
        position: "sidebar"
      });

      // Refresh the events list
      refetch();
    } catch (error: any) {
      console.error("Error in handleDeleteEvent:", error);

      // Error toast with more detailed message
      toast({
        variant: "destructive",
        title: "Error deleting event",
        description: error.message || "Failed to delete event. Please try again.",
        showProgress: true,
        position: "sidebar"
      });
    }
  };
  return <div className="flex flex-col h-full bg-zinc-50/50">
      <Header pageTitle="Events" />
      
      <div className="flex-1 p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Upcoming Events</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {Object.values(groupedEvents).flat().length} events scheduled
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="text-zinc-700 h-9 px-4 shadow-sm border-zinc-200 hover:bg-zinc-100" onClick={() => navigate('/passed-events')}>
                  <CalendarX className="h-4 w-4 mr-2" />
                  Past Events
                </Button>
                
                <Button variant="default" size="sm" onClick={() => navigate('/events/new')} className="h-9 px-4 shadow-sm text-white bg-gray-500 hover:bg-gray-400">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? <div className="flex items-center justify-center h-60 bg-white rounded-xl border border-zinc-100 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
              <p className="text-sm text-zinc-500">Loading events...</p>
            </div>
          </div> : <div className="rounded-xl overflow-hidden shadow-sm">
            <EventsTable groupedEvents={groupedEvents} handleDelete={handleDeleteEvent} className="flex-1" />
          </div>}
      </div>
    </div>;
}