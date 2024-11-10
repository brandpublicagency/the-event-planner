import { Calendar as CalendarIcon, Users, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockEvents";
import FlipCard from "@/components/FlipCard";
import TaskList from "@/components/TaskList";
import ChatBox from "@/components/ChatBox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FlipCard
          front={
            <div className="relative h-full w-full bg-zinc-100 rounded-3xl p-8 flex flex-col">
              <div className="flex-1 space-y-4">
                <div className="text-4xl font-semibold">Louisa Marin</div>
                <div className="text-zinc-500 text-base flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
                  Connecting
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src="https://pink-book.co.za/wp-content/uploads/2024/02/Warm-Karoo-Wedding-Event-Venue-39.png"
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-200">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://pink-book.co.za/wp-content/uploads/2024/02/Warm-Karoo-Wedding-Event-Venue-39.png" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">louisa_marin01</span>
                  <span className="text-xs text-zinc-500">23m ago</span>
                </div>
                <Button className="ml-auto rounded-full px-6" variant="secondary">
                  Add Member
                </Button>
              </div>
            </div>
          }
          back={
            <div className="space-y-2">
              <p className="text-sm">Email: louisa@example.com</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
              <p className="text-sm">Location: San Francisco, CA</p>
            </div>
          }
        />

        <div className="bg-primary rounded-lg flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="h-full"
          />
        </div>

        <ChatBox />

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

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Index;