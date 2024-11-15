import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/EventsTable";
import TaskList from "@/components/TaskList";
import ChatBox from "@/components/ChatBox";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
        .limit(4);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map((ev: any) => ({
          name: ev.venues?.name
        })) || []
      })) || [];
    },
  });

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

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back to your dashboard</p>
        </div>
        <Button 
          onClick={() => navigate('/events/new')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white"
        >
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <TaskList />
        </Card>
        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-sm">
            <ChatBox />
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Upcoming Events</h3>
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