import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventsTable } from "@/components/EventsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Events = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

      // First get the user's team
      const { data: teamMember, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        toast({
          title: "Error",
          description: "Could not fetch team information",
          variant: "destructive",
        });
        return [];
      }

      if (!teamMember) return [];

      // Then get all events created by any team member
      const { data: teamEvents, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          venues:event_venues(
            venue:venues(*)
          )
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        toast({
          title: "Error",
          description: "Could not fetch events",
          variant: "destructive",
        });
        return [];
      }

      return teamEvents || [];
    },
  });

  const handleDelete = async (eventCode: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ deleted_at: new Date().toISOString() })
        .eq('event_code', eventCode);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  // Group events by month and year
  const groupedEvents = events.reduce((acc, event) => {
    if (!event.event_date) return acc;
    const date = new Date(event.event_date);
    const key = format(date, 'MMMM yyyy');
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  if (isLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

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