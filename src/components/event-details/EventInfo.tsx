
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
}

export const EventInfo = ({ event, formattedDate }: EventInfoProps) => {
  // Format the time in 24-hour format (HH:MM)
  const formatTimeDisplay = (timeString: string | null) => {
    if (!timeString) return '';
    return format(parseISO(`2000-01-01T${timeString}`), 'HH:mm');
  };

  const startTime = formatTimeDisplay(event.start_time);
  const endTime = formatTimeDisplay(event.end_time);
  const timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : '';
  
  // Get venue names using the utility function
  const venueNames = getVenueNames(event);
  
  return (
    <div className="mb-8 event-info-container">
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          {event.name} <span className="text-xs font-normal text-zinc-400">{event.event_code}</span>
        </h1>
      </div>
      <div className="text-sm font-semibold text-zinc-600">
        {formattedDate}, {timeDisplay} / {event.pax || 0} Guests / {event.event_type} / {venueNames}
      </div>
    </div>
  );
};
