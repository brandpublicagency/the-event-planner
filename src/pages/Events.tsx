import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import EventsTable from "@/components/EventsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Events = () => {
  const navigate = useNavigate();
  const { currentTeam } = useTenant();
  const { toast } = useToast();
  const [groupedEvents, setGroupedEvents] = useState<Record<string, any[]>>({});

  const handleDelete = async (eventCode: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ deleted_at: new Date().toISOString() })
        .eq('event_code', eventCode)
        .eq('created_by', currentTeam?.id);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });

      // Optionally, you might want to refetch or update the events list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the event.",
        variant: "destructive",
      });
    }
  };

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', currentTeam?.id],
    queryFn: async () => {
      if (!currentTeam) return [];

      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', currentTeam.id);

      if (teamError) throw teamError;

      const userIds = teamMembers.map(member => member.user_id);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:event_venues(
            venues(*)
          ),
          wedding_details(*),
          corporate_details(*)
        `)
        .in('created_by', userIds)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Group events by month and year
      const grouped = data.reduce((acc, event) => {
        const monthYear = event.event_date 
          ? new Date(event.event_date).toLocaleString('default', { month: 'long', year: 'numeric' }) 
          : 'Unscheduled';
        
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(event);
        return acc;
      }, {});

      setGroupedEvents(grouped);
      return data;
    },
    enabled: !!currentTeam,
  });

  if (!currentTeam) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <p>Please select a team to view events.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage your upcoming events and bookings
          </p>
        </div>
        <Button 
          onClick={() => navigate('/events/new')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <EventsTable 
        groupedEvents={groupedEvents} 
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Events;