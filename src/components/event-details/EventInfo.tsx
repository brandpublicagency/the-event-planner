import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/event";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  venueNames: string;
}

export const EventInfo = ({ event, formattedDate, formattedTime, venueNames }: EventInfoProps) => {
  return (
    <div className="print:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 print:text-lg">{event.name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {event.event_code}
          </Badge>
        </div>
      </div>

      <div className="text-sm text-zinc-900">
        {formattedDate}, {formattedTime} / <span className="font-semibold">{event.pax} Guests</span> / Celebration / <span className="font-semibold">{venueNames}</span>
      </div>
    </div>
  );
};