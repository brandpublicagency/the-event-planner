
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
  isDashboard = false,
}) => {
  return (
    <div className="rounded-xl border bg-white">
      <div className={cn(
        "flex items-center gap-2 p-3 border-b",
        isDashboard && "p-2"
      )}>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">{monthYear}</h3>
        <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
          {events.length} {isDashboard ? '' : 'events'}
        </Badge>
      </div>
      
      <div className={cn(
        "divide-y",
        isDashboard && "grid grid-cols-1 gap-2 p-2 divide-y-0"
      )}>
        {events.map((event) => (
          isDashboard ? (
            <DashboardEventItem 
              key={event.event_code} 
              event={event} 
            />
          ) : (
            <EventCard
              key={event.event_code}
              event={event}
              handleDelete={handleDelete}
              isDashboard={isDashboard}
            />
          )
        ))}
      </div>
    </div>
  );
};
