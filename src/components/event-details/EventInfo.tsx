
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  venueNames: string;
}

export const EventInfo = ({ event, formattedDate, formattedTime, venueNames }: EventInfoProps) => {
  return (
    <div className="mb-8 event-info-container">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{event.name}</h1>
        <span className="text-sm text-zinc-500">{event.event_code}</span>
      </div>
      <div className="text-sm font-semibold text-zinc-600">
        {formattedDate}, {event.start_time ? `${format(parseISO(`2000-01-01T${event.start_time}`), 'HH:mm')}${event.end_time ? ` - ${format(parseISO(`2000-01-01T${event.end_time}`), 'HH:mm')}` : ''}` : 'Time not set'} / {event.pax || 0} Guests / {event.event_type} / <span className="font-bold">{venueNames}</span>
      </div>
      <div className="print:hidden">
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
