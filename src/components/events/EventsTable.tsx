
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventMonthGroup } from "./EventMonthGroup";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { CalendarX } from "lucide-react";

interface EventsTableProps {
  groupedEvents: Record<string, Event[]>;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
  className?: string;
}

export const EventsTable: React.FC<EventsTableProps> = ({ 
  groupedEvents, 
  handleDelete, 
  isDashboard = false,
  className 
}) => {
  // Filter out past events and completed events for dashboard view
  const filteredGroupedEvents = isDashboard ? 
    Object.entries(groupedEvents).reduce((acc, [monthYear, events]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredEvents = events.filter(event => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        // Filter out past events and completed events
        return eventDate >= today && !event.completed;
      });

      if (filteredEvents.length > 0) {
        acc[monthYear] = filteredEvents;
      }
      return acc;
    }, {} as Record<string, Event[]>) 
    : groupedEvents;

  if (isDashboard) {
    return (
      <div className="space-y-4">
        {Object.entries(filteredGroupedEvents).map(([monthYear, monthEvents]) => (
          <EventMonthGroup
            key={monthYear}
            monthYear={monthYear}
            events={monthEvents}
            handleDelete={handleDelete}
            isDashboard={true}
          />
        ))}
        {Object.keys(filteredGroupedEvents).length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CalendarX className="h-10 w-10 mb-2 text-muted-foreground/40" />
            <p>No upcoming events</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className={cn(
      isDashboard ? "h-auto" : "h-[calc(100vh-12rem)]",
      className
    )}>
      <div className="space-y-4">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CalendarX className="h-10 w-10 mb-2 text-muted-foreground/40" />
            <p>No events found</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <EventMonthGroup
              key={monthYear}
              monthYear={monthYear}
              events={monthEvents}
              handleDelete={handleDelete}
              isDashboard={isDashboard}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default EventsTable;
