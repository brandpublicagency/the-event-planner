
import type { Event } from "@/types/event";

export const getVenueNames = (event: Event) => {
  if (!event.venues || event.venues.length === 0) {
    return 'No venues';
  }
  return event.venues.join(' + ');
};
