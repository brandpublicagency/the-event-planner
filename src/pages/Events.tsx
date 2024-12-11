import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventsTable } from "@/components/EventsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) return [];

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:event_venues(
            venue:venues(*)
          )
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Group events by month and year
  const groupedEvents = events.reduce((acc, event) => {
    if (!event.event_date) return acc;
    const date = new Date(event.event_date);
    const key = format(date, 'MMMM yyyy');
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  const handleDelete = async (eventCode: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ deleted_at: new Date().toISOString() })
        .eq('event_code', eventCode);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button onClick={() => navigate('/events/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
      <EventsTable groupedEvents={groupedEvents} handleDelete={handleDelete} />
    </div>
  );
};

export default Events;