import { Calendar as CalendarIcon, Users, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockEvents";
import FlipCard from "@/components/FlipCard";
import ChatBox from "@/components/ChatBox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EventsTable from "@/components/EventsTable";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  // Group events by month for the EventsTable
  const groupedEvents = mockEvents.reduce((groups: any, event) => {
    const date = new Date(event.dueDate);
    const monthYear = date.toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    // Transform the event to match expected structure
    groups[monthYear].push({
      ...event,
      event_date: event.dueDate,
      name: event.title,
      event_code: event.event_code || `EVT-${Math.random().toString(36).substr(2, 9)}`,
      event_type: event.event_type || 'Wedding',
      pax: event.pax || 100,
      venues: event.venues || [{ name: 'Default Venue' }]
    });
    return groups;
  }, {});

  const handleDelete = async (eventCode: string) => {
    console.log('Delete event:', eventCode);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FlipCard
          front={
            <div className="relative h-full w-full">
              <img
                src="https://pink-book.co.za/wp-content/uploads/2024/02/Warm-Karoo-Wedding-Event-Venue-39.png"
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-white">
                  <div className="text-2xl font-semibold">Louisa Marin</div>
                  <div className="text-sm opacity-80">louisa@example.com</div>
                </div>
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
          onEdit={handleEditProfile}
        />

        <ChatBox />

        <div className="bg-primary rounded-lg flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="h-full"
          />
        </div>
      </div>

      {/* Events Table Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Upcoming Events</h3>
          <Button onClick={() => console.log('New event clicked')}>
            New Event
          </Button>
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
