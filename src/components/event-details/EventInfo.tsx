import React from 'react';
import type { Event } from "@/types/event";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  venueNames: string;
}

export const EventInfo = ({ event, formattedDate, formattedTime, venueNames }: EventInfoProps) => {
  return (
    <div className="space-y-1 mb-8 px-6 pt-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{event.name}</h1>
        <span className="text-sm text-zinc-500">{event.event_code}</span>
      </div>
      <div className="text-sm text-zinc-600">
        {formattedDate}, {formattedTime} / {event.pax} Guests / Celebration / <span className="font-medium">{venueNames}</span>
      </div>
    </div>
  );
};