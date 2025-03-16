
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/events/EventsTable";
import { groupEventsByMonth } from "@/utils/eventUtils";
import { TaskList } from "@/components/TaskList";
import { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { deleteEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, CalendarClock, CheckSquare, Bell } from "lucide-react";
import { Header } from "@/components/layout/Header";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import type { Event } from "@/types/event";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { tasks, isLoading: isTasksLoading } = useTaskContext();
  
  // Get notifications data
  const { 
    notifications, 
    markAsRead, 
    markAsCompleted, 
    refreshNotifications
  } = useNotifications();

  const {
    data: allEvents = [],
    refetch,
    isLoading: isEventsLoading,
    error: eventsError
  } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      try {
        const {
          data,
          error
        } = await supabase.from('events').select(`*`).eq('completed', false).is('deleted_at', null).gt('event_date', today.toISOString().split('T')[0]).order('event_date', {
          ascending: true
        });
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
    retry: 1
  });
  
  // Refresh notifications when component mounts
  useEffect(() => {
    refreshNotifications().catch(err => {
      console.error('Error refreshing notifications:', err);
    });
  }, [refreshNotifications]);
  
  const events = allEvents.slice(0, 10);
  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Error loading events",
        description: "There was a problem loading upcoming events.",
        variant: "destructive"
      });
    }
  }, [eventsError, toast]);
  
  const upcomingTasks = tasks.filter(task => !task.completed);
  const groupedEvents = groupEventsByMonth(events);
  
  const handleNotificationView = (id: string, relatedId?: string) => {
    // Mark notification as read
    markAsRead(id).catch(err => console.error('Error marking notification as read:', err));
    
    // Navigate to related content if available
    if (relatedId) {
      if (relatedId.includes('event_')) {
        navigate(`/events/${relatedId}`);
      } else if (relatedId.includes('task_')) {
        navigate(`/tasks?selected=${relatedId}`);
      }
    }
  };
  
  const handleNotificationComplete = (id: string) => {
    markAsCompleted(id).catch(err => console.error('Error marking notification as completed:', err));
  };
  
  const handleTaskSelect = (id: string) => {
    navigate(`/tasks?selected=${id}`);
  };

  return <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard" />
      
      <div className="grid grid-cols-1 gap-1 p-6">
        {/* Full width greeting message */}
        <div className="col-span-full">
          <DashboardMessage />
        </div>
        
        {/* Two-column layout underneath greeting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Upcoming Events */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 rounded-xl mb-4 relative" style={{
            backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '15px'
          }}>
              <div className="absolute inset-0 bg-white/75 rounded-xl"></div>
              
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
              {isEventsLoading ? <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div> : events.length === 0 ? <div className="flex items-center justify-center h-40 text-muted-foreground">
                  No upcoming events found
                </div> : <EventsTable groupedEvents={groupedEvents} isDashboard={true} handleDelete={async (eventCode: string) => {
              try {
                await deleteEvent(eventCode);
                toast({
                  title: "Event deleted",
                  description: "Event has been deleted successfully"
                });
                refetch();
              } catch (error: any) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message || "Failed to delete event"
                });
              }
            }} />}
            </div>
          </div>

          {/* Right column - Tasks and Notifications Vertical Layout */}
          <div className="flex flex-col gap-6 h-full">
            {/* Upcoming Tasks */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4 rounded-xl mb-4 relative" style={{
                backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '15px'
              }}>
                <div className="absolute inset-0 bg-white/75 rounded-xl"></div>
                
                <div className="flex items-center gap-2 relative z-10">
                  <CheckSquare className="h-5 w-5 text-zinc-700" />
                  <h3 className="text-lg font-medium text-zinc-900">Upcoming Tasks</h3>
                </div>
                <Button onClick={() => navigate('/tasks?newTask=true')} size="sm" variant="outline" className="rounded-full relative z-10">
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Task
                </Button>
              </div>
              <TaskList tasks={upcomingTasks} onTaskSelect={handleTaskSelect} selectedTaskId={selectedTaskId} hideHeader={true} isDashboard={true} />
            </div>
            
            {/* Latest Updates (Notifications) */}
            <div className="flex flex-col mt-2">
              <div className="flex items-center justify-between p-4 rounded-xl mb-4 relative" style={{
                backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '15px'
              }}>
                <div className="absolute inset-0 bg-white/75 rounded-xl"></div>
                
                <div className="flex items-center gap-2 relative z-10">
                  <Bell className="h-5 w-5 text-zinc-700" />
                  <h3 className="text-lg font-medium text-zinc-900">Latest Updates</h3>
                </div>
                <Button 
                  onClick={() => refreshNotifications()} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full relative z-10"
                >
                  Refresh
                </Button>
              </div>
              
              <div className="h-auto">
                <NotificationsList 
                  notifications={notifications.slice(0, 3)} 
                  onViewDetail={handleNotificationView}
                  onCompleteTask={handleNotificationComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;
