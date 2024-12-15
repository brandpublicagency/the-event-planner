import type { Event } from "@/types/event";

export const getVenueNames = (event: Event) => {
  if (!event.venues || event.venues.length === 0) {
    if (!event.event_venues || event.event_venues.length === 0) return 'No venues';
    return event.event_venues.map(ev => ev.venues?.name).filter(Boolean).join(' + ') || 'No venues';
  }
  return event.venues.map(v => v.name).join(' + ');
};