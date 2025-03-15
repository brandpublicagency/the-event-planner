import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { DashboardEventItem } from "./DashboardEventItem";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";

interface EventMonthGroupProps {
  monthYear: string;
  events: Event[];
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

export const EventMonthGroup: React.FC<EventMonthGroupProps> = ({
  monthYear,
  events,
  handleDelete,
  isDashboard = false
}) => {
  if (isDashboard) {
    return (
      <>
        {events.map(event => (
          <DashboardEventItem key={event.event_code} event={event} handleDelete={handleDelete} />
        ))}
      </>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm bg-white">
      <div className="flex items-center gap-2 p-3 border-b bg-zinc-50/50">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">{monthYear}</h3>
        <Badge variant="secondary" className="px-2 py-0.5 text-xs rounded-full border border-gray-200">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </Badge>
      </div>
      
      <div className="divide-y divide-gray-100">
        {events.map(event => <EventCard key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} />)}
      </div>
    </div>
  );
};
