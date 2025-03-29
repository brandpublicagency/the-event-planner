
import React from "react";
import type { Event } from "@/types/event";
import { format } from "date-fns";
import { MapPin, Users, Calendar } from "lucide-react";

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
      <div className="flex items-center">
        <h3 className="text-base font-medium text-gray-800 mb-0.5 line-clamp-1">{event.name}</h3>
        <span className="ml-2 text-xs text-zinc-400">{event.event_code}</span>
      </div>
      <div className="flex items-center flex-wrap gap-x-3 text-sm text-gray-600">
        {event.event_type && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            {event.event_type}
          </span>
        )}
        
        {event.pax && (
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            {event.pax} guests
          </span>
        )}
        
        {venueStr && venueStr !== 'No venues selected' && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            {venueStr}
          </span>
        )}
      </div>
    </div>
  );
};
