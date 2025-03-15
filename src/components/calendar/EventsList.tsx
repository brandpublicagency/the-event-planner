
import React from "react";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import type { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";

interface EventsListProps {
  date?: Date;
  events?: Event[];
  isLoading?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  date,
  events = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading events...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-sm text-zinc-500">
        No events scheduled for {date ? format(date, "MMMM d, yyyy") : "this date"}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.event_code}
          event={event}
          isDashboard
        />
      ))}
    </div>
  );
};
