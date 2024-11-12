import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { format } from "date-fns";

interface EventsListProps {
  date?: Date;
  events?: Event[];
  isLoading: boolean;
}

export const EventsList = ({ date, events, isLoading }: EventsListProps) => {
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

  if (!events?.length) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
        <p>No events scheduled for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.event_code}
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50/50 transition-colors duration-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h5 className="font-medium text-lg text-zinc-900">{event.name}</h5>
                <Badge variant="secondary" className="bg-zinc-100">
                  {event.event_type}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500">
                {event.pax} Guests • {format(new Date(event.event_date || ''), 'h:mm a')}
              </p>
              <p className="text-sm text-zinc-500">
                Venues: {event.venues?.map((v) => v.name).join(', ')}
              </p>
              {event.description && (
                <p className="text-sm text-zinc-600 mt-2">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};