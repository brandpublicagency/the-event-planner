import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/EventsTable";

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const mockEvents = [
    {
      event_code: "EVENT-0101",
      name: "Sample Wedding",
      event_type: "Wedding",
      event_date: "2024-01-01",
      status: "Confirmed",
      pax: 100,
      venues: [{ name: "Main Hall" }]
    }
  ];

  const handleDelete = async (eventCode: string) => {
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  const groupedEvents = mockEvents.reduce((groups: any, event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(event);
    return groups;
  }, {});

  const filteredEvents = Object.entries(groupedEvents || {}).reduce(
    (acc: any, [monthYear, monthEvents]: [string, any]) => {
      const filteredMonthEvents = (monthEvents as any[]).filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.bride_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.groom_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.client_address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredMonthEvents.length > 0) {
        acc[monthYear] = filteredMonthEvents;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
          <p className="text-muted-foreground">Manage your upcoming events and bookings</p>
        </div>
        <Button onClick={() => navigate('/events/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <EventsTable 
        groupedEvents={filteredEvents}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Events;