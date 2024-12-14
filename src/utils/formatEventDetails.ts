import { format } from "date-fns";
import type { Event } from "@/types/event";

export const formatEventDetails = (event: Event) => {
  const venues = event.event_venues
    ?.map(ev => ev.venues?.name)
    .filter(Boolean)
    .join(' + ') || 'No venue specified';
  
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'dd MMMM yyyy')
    : 'Date not set';

  const formattedTime = event.start_time 
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : 'Time not set';

  let clientDetails = '';
  if (event.wedding_details) {
    clientDetails = `Wedding of ${event.wedding_details.bride_name || 'Bride'} & ${event.wedding_details.groom_name || 'Groom'}`;
  } else if (event.corporate_details) {
    clientDetails = `Corporate event for ${event.corporate_details.company_name || 'Unknown Company'}`;
  }

  return `Event: ${event.name}
Type: ${event.event_type}
Date: ${formattedDate}
Time: ${formattedTime}
Venue: ${venues}
Details: ${clientDetails}
Event Code: ${event.event_code}
Status: ${event.completed ? 'Completed' : 'Active'}`;
};