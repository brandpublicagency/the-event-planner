import { Calendar as CalendarIcon, Users, CalendarDays, CheckSquare, User2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockEvents";
import FlipCard from "@/components/FlipCard";
import TaskList from "@/components/TaskList";
import { useState } from "react";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: stats } = useQuery({
    queryKey: ['eventStats'],
    queryFn: async () => {
      const currentMonth = new Date().getMonth();
      const totalGuests = mockEvents.reduce((sum, event) => sum + (event.pax || 0), 0);
      const weddingsCount = mockEvents.filter(e => e.event_type === 'Wedding').length;
      const upcomingGuests = mockEvents
        .filter(e => new Date(e.dueDate).getMonth() === currentMonth)
        .reduce((sum, event) => sum + (event.pax || 0), 0);
      
      return {
        totalGuests,
        weddingsCount,
        upcomingGuests
      };
    },
  });

  const upcomingEvents = mockEvents
    .filter(event => new Date(event.dueDate) > new Date())
    .slice(0, 3);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Profile Cards */}
        <FlipCard
          front={
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <User2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Event Planner</p>
                </div>
              </div>
              <p className="text-sm">Click to view contact details</p>
            </div>
          }
          back={
            <div className="space-y-2">
              <p className="text-sm">Email: john@example.com</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
              <p className="text-sm">Location: San Francisco, CA</p>
            </div>
          }
        />

        {/* Calendar Card */}
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        {/* Stats Card */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Guests This Month</span>
              <span className="font-semibold">{stats?.upcomingGuests || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Weddings</span>
              <span className="font-semibold">{stats?.weddingsCount || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Guests Served</span>
              <span className="font-semibold">{stats?.totalGuests || 0}</span>
            </div>
          </div>
        </Card>

        {/* Upcoming Events Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.event_code} className="flex items-center space-x-4">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tasks Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Index;