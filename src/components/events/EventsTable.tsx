
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventMonthGroup } from "./EventMonthGroup";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { CalendarX, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventsTableProps {
  groupedEvents: Record<string, Event[]>;
  isLoading?: boolean;
  handleDelete?: (eventCode: string) => Promise<void>;
  onDelete?: (event: Event) => void;
  isDashboard?: boolean;
  className?: string;
  // Add these props for backward compatibility
  events?: Event[];
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({
  groupedEvents = {},
  isLoading = false,
  handleDelete,
  onDelete,
  isDashboard = false,
  className,
  events,
  // For backward compatibility
  onEdit,
  onView
}) => {
  // If events array is provided but groupedEvents is not, create groupedEvents structure
  let effectiveGroupedEvents = groupedEvents;
  if (events && events.length > 0 && Object.keys(groupedEvents).length === 0) {
    // Create a simple monthly grouping
    effectiveGroupedEvents = events.reduce((acc, event) => {
      if (!event.event_date) {
        if (!acc["No Date"]) acc["No Date"] = [];
        acc["No Date"].push(event);
        return acc;
      }
      const month = format(parseISO(event.event_date), "MMMM yyyy");
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
  }

  // Filter out past events and completed events for dashboard view
  const filteredGroupedEvents = isDashboard ? Object.entries(effectiveGroupedEvents).reduce((acc, [monthYear, events]) => {
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
  }, {} as Record<string, Event[]>) : effectiveGroupedEvents;

  if (isDashboard) {
    // Keep the dashboard view unchanged but reduce spacing between cards
    return (
      <div className="space-y-2.5 pt-2">
        {Object.entries(filteredGroupedEvents).map(([monthYear, monthEvents]) => (
          <EventMonthGroup 
            key={monthYear} 
            monthYear={monthYear} 
            events={monthEvents} 
            handleDelete={handleDelete} 
            isDashboard={true} 
            onDelete={onDelete} 
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
    <ScrollArea className={cn(isDashboard ? "h-auto" : "h-full", className)}>
      <div className="space-y-4 pb-4 bg-transparent">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(filteredGroupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-transparent rounded-lg">
            <CalendarX className="h-12 w-12 mb-3 text-muted-foreground/40" />
            <p className="text-base">No events found</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first event to get started</p>
          </div>
        ) : (
          Object.entries(filteredGroupedEvents).map(([monthYear, monthEvents]) => (
            <EventMonthGroup 
              key={monthYear} 
              monthYear={monthYear} 
              events={monthEvents} 
              handleDelete={handleDelete} 
              isDashboard={isDashboard} 
              onEdit={onEdit} 
              onView={onView} 
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default EventsTable;
