import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/EventsTable";
import ChatBox from "@/components/ChatBox";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { TaskList } from "@/components/TaskList";
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { tasks } = useTaskContext();

  const { data: events = [], refetch } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venues (
              name
            )
          )
        `)
        .eq('created_by', user.id)
        .gte('event_date', today.toISOString().split('T')[0])
        .is('completed', false)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched dashboard events:', data);

      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map((ev: any) => ({
          id: ev.venues?.id,
          name: ev.venues?.name
        })) || []
      })) || [];
    },
  });

  const handleDelete = async (eventCode: string) => {
    try {
      // First delete related records
      const deleteRelated = async () => {
        await Promise.all([
          supabase.from('wedding_details').delete().eq('event_code', eventCode),
          supabase.from('corporate_details').delete().eq('event_code', eventCode),
          supabase.from('menu_selections').delete().eq('event_code', eventCode),
          supabase.from('event_venues').delete().eq('event_code', eventCode),
          supabase.from('event_documents').delete().eq('event_code', eventCode),
        ]);
      };

      await deleteRelated();

      // Then delete the event itself
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

  // Filter for upcoming tasks
  const upcomingTasks = tasks.filter(task => !task.completed);

  const handleTaskSelect = (id: string) => {
    navigate(`/tasks?selected=${id}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="w-full">
        <ChatBox />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <Button onClick={() => navigate('/events/new')} size="sm">
              New Event
            </Button>
          </div>
          <div className="h-[400px] overflow-auto">
            <EventsTable 
              groupedEvents={groupedEvents}
              handleDelete={handleDelete}
              isDashboard={true}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
            <Button onClick={() => navigate('/tasks')} size="sm">
              New Task
            </Button>
          </div>
          <div className="h-[400px] overflow-auto">
            <TaskList 
              tasks={upcomingTasks}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTaskId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;