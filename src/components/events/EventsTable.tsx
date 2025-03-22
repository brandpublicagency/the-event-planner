
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
    // Keep the dashboard view unchanged but reduce spacing between cards
    return (
      <div className="space-y-1.5 pt-3">
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
      isDashboard ? "h-auto" : "h-full",
      className
    )}>
      <div className="space-y-4 pb-4">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-white rounded-lg">
            <CalendarX className="h-12 w-12 mb-3 text-zinc-300" />
            <p className="text-base">No events found</p>
            <p className="text-sm text-zinc-400 mt-1">Create your first event to get started</p>
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
