
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
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{monthYear}</h3>
          <Badge variant="secondary" className="px-2 py-0.5 text-xs rounded-full bg-white text-zinc-600 border border-zinc-100">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {events.map(event => (
            <DashboardEventItem key={event.event_code} event={event} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">{monthYear}</h3>
        <Badge variant="secondary" className="px-2 py-0.5 text-xs rounded-full bg-white border border-gray-200">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </Badge>
      </div>
      
      <div className="divide-y">
        {events.map(event => <EventCard key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} />)}
      </div>
    </div>
  );
};
