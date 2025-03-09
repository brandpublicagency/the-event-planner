
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import ChatBox from "@/components/ChatBox";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { TaskList } from "@/components/TaskList";
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { deleteEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { tasks } = useTaskContext();

  const { data: events = [], refetch, isLoading: isEventsLoading } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`*`)
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
      return data || [];
    },
    retry: 1,
  });

  const upcomingTasks = tasks.filter(task => !task.completed);

  const handleTaskSelect = (id: string) => {
    navigate(`/tasks?selected=${id}`);
  };

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard" />
      
      <div className="pt-4 px-6">
        <ChatBox />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-zinc-900">Upcoming Events</h3>
            <Button onClick={() => navigate('/events/new')} size="sm" variant="outline" className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
          <div className="overflow-auto">
            {isEventsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading events...</p>
              </div>
            ) : (
              <EventsTable 
                groupedEvents={groupedEvents}
                isDashboard={true}
                handleDelete={async (eventCode: string) => {
                  try {
                    await deleteEvent(eventCode);
                    toast({
                      title: "Event deleted",
                      description: "Event has been deleted successfully",
                    });
                    refetch();
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error.message || "Failed to delete event",
                    });
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-zinc-900">Upcoming Tasks</h3>
            <Button onClick={() => navigate('/tasks')} size="sm" variant="outline" className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
          <div className="overflow-auto">
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
