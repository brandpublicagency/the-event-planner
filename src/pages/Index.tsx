import { Calendar, ListTodo, Users, CalendarDays } from "lucide-react";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: eventStats } = useQuery({
    queryKey: ['eventStats'],
    queryFn: async () => {
      // Mock event stats
      return {
        total: 10,
        upcoming: 5,
        inquiries: 3,
        weddings: 4
      };
    },
  });

  const handleMetricClick = (metric: string) => {
    navigate('/events');
  };

  const upcomingEvents = [
    {
      title: "Sample Wedding",
      description: "Wedding Event",
      progress: 75,
      teamSize: 4,
      dueDate: "2024-01-01",
      event_code: "EVENT-0101",
      venues: [{ name: "The Gallery" }]
    }
  ];

  const moreUpcomingEvents = [
    {
      title: "Corporate Event",
      description: "Annual Meeting",
      progress: 45,
      teamSize: 3,
      dueDate: "2024-01-15",
      event_code: "EVENT-0102",
      venues: [{ name: "The Grand Hall" }]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">Event Planning Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Events"
              value={eventStats?.total || 0}
              icon={<Calendar className="h-5 w-5" />}
              onClick={() => handleMetricClick("Total Events")}
            />
            <MetricCard
              title="Upcoming Events"
              value={eventStats?.upcoming || 0}
              icon={<CalendarDays className="h-5 w-5" />}
              trend={{ value: 12, isUpward: true }}
              onClick={() => handleMetricClick("Upcoming Events")}
            />
            <MetricCard
              title="New Inquiries"
              value={eventStats?.inquiries || 0}
              icon={<ListTodo className="h-5 w-5" />}
              onClick={() => handleMetricClick("New Inquiries")}
            />
            <MetricCard
              title="Wedding Events"
              value={eventStats?.weddings || 0}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 4, isUpward: true }}
              onClick={() => handleMetricClick("Wedding Events")}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/events")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {moreUpcomingEvents.map((event) => (
                  <ProjectCard 
                    key={event.event_code} 
                    {...event} 
                    onClick={() => toast({ 
                      title: `Event: ${event.title}`, 
                      description: "Opening event details." 
                    })} 
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/events")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <ProjectCard 
                    key={event.event_code} 
                    {...event} 
                    onClick={() => toast({ 
                      title: `Event: ${event.title}`, 
                      description: "Opening event details." 
                    })} 
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;