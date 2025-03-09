
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";

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
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{event.name} {event.event_code}</h1>
      </div>
      <div className="text-sm font-semibold text-zinc-600">
        {formattedDate}, {timeDisplay} / {event.pax || 0} Guests / {event.event_type} / {venueNames}
      </div>
      <div className="print:hidden">
        {/* Additional contact information hidden from print view */}
        {event.primary_name && (
          <div className="text-sm text-zinc-600">
            Primary Contact: {event.primary_name} {event.primary_email ? `(${event.primary_email})` : ''} {event.primary_phone ? `- ${event.primary_phone}` : ''}
          </div>
        )}
        {event.secondary_name && (
          <div className="text-sm text-zinc-600">
            Secondary Contact: {event.secondary_name} {event.secondary_email ? `(${event.secondary_email})` : ''} {event.secondary_phone ? `- ${event.secondary_phone}` : ''}
          </div>
        )}
        {event.company && (
          <div className="text-sm text-zinc-600">
            Company: {event.company} {event.vat_number ? `(VAT: ${event.vat_number})` : ''}
          </div>
        )}
        {event.address && (
          <div className="text-sm text-zinc-600">
            Address: {event.address}
          </div>
        )}
      </div>
    </div>
  );
};
