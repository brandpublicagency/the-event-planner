
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useEvents } from "@/hooks/useEvents";
import { EventsList } from "@/components/events/EventsList";
import { DeleteEventDialog } from "@/components/events/DeleteEventDialog";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Event } from "@/types/event";
import { groupEventsByMonth } from "@/utils/eventUtils";

const PassedEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    eventToDelete,
    setEventToDelete,
    handleDeleteEvent,
    confirmDelete,
    isDeleting,
    isPermanentDelete,
    setIsPermanentDelete
  } = useEvents();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['passed-events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .is('deleted_at', null)
        .or(`completed.eq.true,event_date.lte.${todayIso}`)
        .order('event_date', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch passed events",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Event[];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Group events by month
  const groupedEvents = events.reduce((acc: Record<string, Event[]>, event) => {
    if (!event.event_date) {
      if (!acc["No Date"]) acc["No Date"] = [];
      acc["No Date"].push(event);
      return acc;
    }
    const month = format(new Date(event.event_date), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {});

  // Filter events based on search query
  const filteredEvents = Object.entries(groupedEvents).reduce(
    (acc: Record<string, Event[]>, [monthYear, monthEvents]) => {
      if (!searchQuery) {
        acc[monthYear] = monthEvents;
        return acc;
      }
      
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
  
  return (
    <div className="flex flex-col h-full">
      <Header title="Passed Events" />

      <div className="flex-1 p-6 bg-muted overflow-auto">
        <EventsList 
          groupedEvents={filteredEvents} 
          isLoading={isLoading}
          onDelete={(event) => {
            setEventToDelete(event);
            setIsDeleteDialogOpen(true);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alternateLink={{
            path: "/events",
            label: "Upcoming Events"
          }}
        />
      </div>

      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        event={eventToDelete}
        onDelete={confirmDelete}
        isPermanentDelete={isPermanentDelete}
        onPermanentDeleteChange={setIsPermanentDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PassedEvents;
