import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EventsTable from "@/components/EventsTable";
import ProfileBox from "@/components/ProfileBox";
import ChatBox from "@/components/ChatBox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch only upcoming events for dashboard
  const { data: events = [], refetch } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
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
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .limit(4); // Only get the next 4 upcoming events

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

  // Group events by month for the EventsTable
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
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <ProfileBox />
        </div>
        <div className="w-full">
          <ChatBox />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Upcoming Events</h3>
          <Button onClick={() => navigate('/events/new')}>
            New Event
          </Button>
        </div>
        <EventsTable 
          groupedEvents={groupedEvents}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Index;