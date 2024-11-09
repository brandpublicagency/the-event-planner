import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

const Events = () => {
  const navigate = useNavigate();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          pax,
          event_date,
          event_type,
          status,
          venue:venues(name),
          bride_name,
          groom_name,
          client_address
        `)
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Group events by month
  const groupedEvents = events?.reduce((groups: any, event) => {
    const date = parseISO(event.event_date);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(event);
    return groups;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Tentative':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inquiry':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <Input placeholder="Search events..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-8">
          {groupedEvents && Object.entries(groupedEvents).map(([monthYear, monthEvents]: [string, any]) => (
            <div key={monthYear} className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">{monthYear}</h3>
                <Badge variant="secondary" className="ml-2">
                  {monthEvents.length} events
                </Badge>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] px-4 py-3 text-sm font-medium text-muted-foreground">
                  <div>Event Details</div>
                  <div>Date</div>
                  <div>Venue</div>
                  <div>Type</div>
                  <div>Guests</div>
                  <div>Status</div>
                </div>
                <Separator />
                {monthEvents.map((event: any, index: number) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] items-center px-4 py-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {event.bride_name && event.groom_name 
                          ? `${event.bride_name} & ${event.groom_name}`
                          : event.client_address}
                      </span>
                    </div>
                    <div>{format(parseISO(event.event_date), 'dd MMM yyyy')}</div>
                    <div>{event.venue?.name || 'TBC'}</div>
                    <div>
                      <Badge variant="outline">
                        {event.event_type}
                      </Badge>
                    </div>
                    <div>{event.pax || 'TBC'}</div>
                    <div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    {index !== monthEvents.length - 1 && <Separator className="col-span-6 my-0" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Events;