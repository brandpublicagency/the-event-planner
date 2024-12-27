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

  const { data: events = [], refetch, isLoading: isEventsLoading } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venues (
              id,
              name
            )
          )
        `)
        .gte('event_date', today.toISOString().split('T')[0])
        .eq('completed', false)
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
    retry: 1,
  });

  // Filter for upcoming tasks
  const upcomingTasks = tasks.filter(task => !task.completed);

  const handleTaskSelect = (id: string) => {
    navigate(`/tasks?selected=${id}`);
  };

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="w-full px-4 md:px-8">
        <ChatBox />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <Button onClick={() => navigate('/events/new')} size="sm">
              New Event
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {isEventsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading events...</p>
              </div>
            ) : (
              <EventsTable 
                groupedEvents={groupedEvents}
                isDashboard={true}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
            <Button onClick={() => navigate('/tasks')} size="sm">
              New Task
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
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