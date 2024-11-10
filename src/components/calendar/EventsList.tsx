import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/types/event";

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
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
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
          className="rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 transition-colors duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium text-lg text-zinc-900">{event.name}</h5>
              <p className="text-sm text-zinc-500 mt-1">
                {event.event_type} - {event.pax} Pax
              </p>
              <p className="text-sm text-zinc-500 mt-1">
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