
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import ChatBox from "@/components/ChatBox";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { TaskList } from "@/components/TaskList";
import { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { deleteEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, CalendarClock, CheckSquare } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import type { Event } from "@/types/event";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { tasks, isLoading: isTasksLoading } = useTaskContext();

  const { data: allEvents = [], refetch, isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const { data, error } = await supabase
          .from('events')
          .select(`*`)
          .eq('completed', false)
          .is('deleted_at', null)
          .gt('event_date', today.toISOString().split('T')[0])
          .order('event_date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }

        console.log('Fetched dashboard events:', data);
        return data || [] as Event[];
      } catch (error) {
        console.error('Dashboard events fetch error:', error);
        throw error;
      }
    },
    retry: 1,
  });

  const events = allEvents.slice(0, 10);

  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Error loading events",
        description: "There was a problem loading upcoming events.",
        variant: "destructive",
      });
    }
  }, [eventsError, toast]);

  const upcomingTasks = tasks.filter(task => !task.completed);

  const handleTaskSelect = (id: string) => {
    navigate(`/tasks?selected=${id}`);
  };

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
        {/* Left Column - Upcoming Events (spans 6 columns on desktop) */}
        <div className="md:col-span-6 flex flex-col order-3 md:order-1 h-full overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 border-b rounded-xl mb-4 relative"
            style={{ 
              backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '15px'
            }}
          >
            {/* White overlay with 90% opacity */}
            <div className="absolute inset-0 bg-white/90 rounded-xl"></div>
            
            <div className="flex items-center gap-2 relative z-10">
              <CalendarClock className="h-5 w-5 text-zinc-700" />
              <h3 className="text-lg font-medium text-zinc-900">Upcoming Events</h3>
            </div>
            <Button onClick={() => navigate('/events/new')} size="sm" variant="outline" className="rounded-full relative z-10">
              <Plus className="h-4 w-4 mr-1.5" />
              New Event
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {isEventsLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No upcoming events found
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

        {/* Right Column - Greeting, Chat, and Tasks (spans 6 columns on desktop) */}
        <div className="md:col-span-6 order-1 md:order-2 flex flex-col space-y-6">
          {/* Greeting Card */}
          <Card className="rounded-xl p-6 bg-rose-50 border-0">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">Hello LeRoux,</h2>
              <p className="text-gray-700">
                Today is <span className="font-semibold">Karla + Regard's Wedding Day!</span> Remember, this is their most special day, and you are part of it! Good luck, and kick ass!
              </p>
            </div>
          </Card>
          
          {/* Chat Box */}
          <div className="order-2 h-96">
            <ChatBox />
          </div>
          
          {/* Upcoming Tasks Section */}
          <div className="order-4 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-zinc-700" />
                <h3 className="text-lg font-medium text-zinc-900">Upcoming Tasks</h3>
              </div>
              <Button onClick={() => navigate('/tasks/new')} size="sm" variant="outline" className="rounded-full">
                <Plus className="h-4 w-4 mr-1.5" />
                New Task
              </Button>
            </div>
            
            <TaskList 
              tasks={upcomingTasks}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTaskId}
              hideHeader={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
