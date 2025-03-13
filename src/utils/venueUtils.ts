
import { Event } from "@/types/event";

/**
 * Extracts venue names from different possible event venue data structures
 */
export const getVenueNames = (event: Event): string => {
  // First attempt: Extract from venues array directly
  if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
    return event.venues.join(', ');
  }
  
  // Second attempt: Use event_venues relationship
  if (event.event_venues && Array.isArray(event.event_venues) && event.event_venues.length > 0) {
    const venues = event.event_venues
      .map(ev => ev.venues?.name)
      .filter(Boolean);
    
    if (venues.length > 0) {
      return venues.join(', ');
    }
  }
  
  // Fallback
  return 'No venues selected';
};
