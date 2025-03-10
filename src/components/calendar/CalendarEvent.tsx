
import React from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";

interface CalendarEventProps {
  event: Event;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  const navigate = useNavigate();
  
  // Color based on event type
  const getEventColor = (eventType: string | null) => {
    switch (eventType?.toLowerCase()) {
      case 'wedding':
        return "border-pink-500 bg-pink-50";
      case 'corporate':
        return "border-blue-500 bg-blue-50";
      case 'social':
        return "border-purple-500 bg-purple-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const eventTime = event.event_date 
    ? format(parseISO(event.event_date), "HH:mm")
    : "";

  return (
    <div
      onClick={() => navigate(`/events/${event.event_code}`)}
      className={cn(
        "px-2 py-1 text-xs rounded cursor-pointer border-l-2",
        getEventColor(event.event_type)
      )}
    >
      <div className="flex items-center">
        <div className="mr-1 text-zinc-500">{eventTime}</div>
        <div className="font-medium truncate" title={event.name}>
          {event.name}
        </div>
      </div>
    </div>
  );
};
