import React from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventsListProps {
  date?: Date;
  events?: Event[];
  isLoading: boolean;
}

export const EventsList = ({ date, events, isLoading }: EventsListProps) => {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    if (date) {
      navigate(`/events/new?date=${date.toISOString().split('T')[0]}`);
    } else {
      navigate('/events/new');
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
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddEvent}
          className="h-8 px-3 flex items-center gap-1 hover:bg-zinc-50"
        >
          <PlusCircle className="h-4 w-4" />
          Add event
        </Button>
      </div>

      {!events?.length ? (
        <div className="text-center py-12 text-zinc-500">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-sm">No events scheduled for this date.</p>
          <p className="text-xs mt-1 text-zinc-400">Select another date to view events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.event_code}
              className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50/50 transition-all duration-200 group relative"
            >
              <Badge 
                variant="secondary" 
                className="absolute top-3 right-3 bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {event.event_type}
              </Badge>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pr-24">
                <div className="space-y-2 flex-1">
                  <Link 
                    to={`/events/${event.event_code}`}
                    className="inline-block font-medium text-lg text-zinc-900 group-hover:text-zinc-700 transition-colors hover:underline"
                  >
                    {event.name}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                    <span>{event.pax} Guests</span>
                    <span>•</span>
                    <span>{format(new Date(event.event_date || ''), 'h:mm a')}</span>
                    {event.venues?.map((venue, index) => (
                      <React.Fragment key={venue.id || index}>
                        <span>•</span>
                        <Badge 
                          variant="outline" 
                          className="bg-zinc-50 hover:bg-zinc-100"
                        >
                          {venue.name}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                  {event.description && (
                    <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};