
import React from "react";
import type { Event } from "@/types/event";
import { format } from "date-fns";

interface EventContentColumnProps {
  event: Event;
  venueStr: string;
}

export const EventContentColumn: React.FC<EventContentColumnProps> = ({
  event,
  venueStr
}) => {
  // Format the event date if it exists
  const eventDate = event.event_date 
    ? format(new Date(event.event_date), "d MMMM yyyy") 
    : null;
  
  return (
    <div className="flex-1 py-3 px-5">
      <h3 className="text-base font-medium text-gray-800 mb-0.5 line-clamp-1">{event.name}</h3>
      <div className="flex flex-col text-sm text-gray-600">
        {event.event_type && (
          <span className="line-clamp-1">
            {event.event_type}
            {event.guest_count ? ` • ${event.guest_count} guests` : ''}
          </span>
        )}
        {venueStr && <span className="line-clamp-1">{venueStr}</span>}
      </div>
    </div>
  );
};
