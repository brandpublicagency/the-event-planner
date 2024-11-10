import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/EventsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venue_id,
            venues (
              name
            )
          )
        `)
        .order('event_date', { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  const groupedEvents = events.reduce((groups: any, event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push({
      ...event,
      venues: event.event_venues?.map((ev: any) => ({
        name: ev.venues?.name
      })) || []
    });
    return groups;
  }, {});

  const filteredEvents = Object.entries(groupedEvents || {}).reduce(
    (acc: any, [monthYear, monthEvents]: [string, any]) => {
      const filteredMonthEvents = (monthEvents as any[]).filter(
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

  const handleDelete = async (eventCode: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_code', eventCode);

      if (error) throw error;

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
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">Manage your events and bookings</p>
        </div>
        <Button onClick={() => navigate('/events/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <EventsTable 
        groupedEvents={filteredEvents}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Events;