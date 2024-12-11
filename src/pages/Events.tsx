import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { EventsTable } from "@/components/EventsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const { currentTeam } = useTenant();
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
    queryKey: ['events', currentTeam?.id],
    queryFn: async () => {
      if (!currentTeam?.id) return [];

      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', currentTeam.id);

      if (!teamMembers?.length) return [];

      const userIds = teamMembers.map(member => member.user_id);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:event_venues(
            venue:venues(*)
          )
        `)
        .in('created_by', userIds)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTeam?.id,
  });

  if (isLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <h2 className="text-xl font-semibold">Please select a team to view events</h2>
        <p className="text-gray-500">Use the team selector in the header to choose a team</p>
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