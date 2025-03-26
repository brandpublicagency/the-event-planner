
import React from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { formatTimeRange } from "@/utils/formatDate";

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

  // Use formatTimeRange utility to display the event time
  const eventTime = formatTimeRange(event.start_time, event.end_time);

  return (
    <div
      onClick={() => navigate(`/events/${event.event_code}`)}
      className={cn(
        "px-2 py-1 text-xs rounded cursor-pointer border-l-2",
        getEventColor(event.event_type)
      )}
    >
      <div className="flex flex-col">
        <div className="text-zinc-500 text-[0.65rem]">{eventTime}</div>
        <div className="font-medium truncate text-xs" title={event.name}>
          {event.name}
        </div>
      </div>
    </div>
  );
};
