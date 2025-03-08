
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { EventMonthGroup } from "@/components/events/EventMonthGroup";
import { EventCard } from "@/components/events/EventCard";

interface EventsTableProps {
  groupedEvents: Record<string, Event[]>;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
  className?: string;
}

export const EventsTable = ({ 
  groupedEvents, 
  handleDelete, 
  isDashboard = false,
  className 
}: EventsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {Object.entries(filteredGroupedEvents).map(([monthYear, monthEvents]) => (
            <EventMonthGroup
              key={monthYear}
              monthYear={monthYear}
              events={monthEvents}
              isDashboard={true}
            />
          ))}
          {Object.keys(filteredGroupedEvents).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className={cn(
      isDashboard ? "h-[400px]" : "h-[calc(100vh-12rem)]",
      className
    )}>
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <EventMonthGroup
            key={monthYear}
            monthYear={monthYear}
            events={monthEvents}
            handleDelete={handleDelete}
            isDashboard={isDashboard}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EventsTable;
