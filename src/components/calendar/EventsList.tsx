
import React from "react";
import { CalendarIcon, PlusCircle, CalendarPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { format, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventsListProps {
  date?: Date;
  events?: Event[];
  isLoading: boolean;
  calendarConnected?: boolean;
}

export const EventsList = ({ date, events, isLoading, calendarConnected = false }: EventsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddEvent = () => {
    if (date) {
      navigate(`/events/new?date=${date.toISOString().split('T')[0]}`);
    } else {
      navigate('/events/new');
    }
  };

  const syncEventToCalendar = async (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!calendarConnected) {
      toast({
        title: "Calendar Not Connected",
        description: "Please connect to Google Calendar first",
        variant: "default",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-event-to-calendar', {
        body: { event }
      });
      
      if (error) throw error;
      
      toast({
        title: "Event Synced",
        description: "Event has been synced to Google Calendar"
      });
    } catch (error) {
      console.error('Error syncing event to calendar:', error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync event to Google Calendar"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-zinc-600">
          {date ? format(date, "MMMM d, yyyy") : "Events"}
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddEvent}
          className="h-8 px-3 flex items-center gap-1 hover:bg-zinc-100 hover:text-zinc-900 border-zinc-200"
        >
          <PlusCircle className="h-4 w-4" />
          Add event
        </Button>
      </div>

      {!events?.length ? (
        <div className="text-center py-12 text-zinc-500">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-xs">No events scheduled for this date.</p>
          <p className="text-[10px] mt-1 text-zinc-400">Select another date to view events</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Link
              key={event.event_code}
              to={`/events/${event.event_code}`}
              className="block p-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-medium text-zinc-900 truncate">{event.name}</h4>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 text-[10px]">
                      {event.event_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>
                      {event.start_time ? format(parseISO(`2000-01-01T${event.start_time}`), 'HH:mm') : 'Time not set'}
                    </span>
                    <span>•</span>
                    <span>{event.pax} Guests</span>
                    {event.venues?.map((venue) => (
                      <React.Fragment key={venue}>
                        <span>•</span>
                        <span className="text-zinc-600">{venue}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={(e) => syncEventToCalendar(event, e)}
                  title={calendarConnected ? "Sync to Google Calendar" : "Connect to Google Calendar first"}
                >
                  <CalendarPlus className="h-4 w-4 text-zinc-500" />
                  <span className="sr-only">Sync to Calendar</span>
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
