import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockEvents";
import FlipCard from "@/components/FlipCard";
import ChatBox from "@/components/ChatBox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EventsTable from "@/components/EventsTable";
import ProfileBox from "@/components/ProfileBox";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        <div className="w-full">
          <ProfileBox />
        </div>

        <div className="w-full bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="h-full"
          />
        </div>

        <div className="w-full">
          <ChatBox />
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