
import { format } from "date-fns";
import type { Event } from "@/types/event";

export const formatEventDetails = (event: Event): string => {
  // Format date and time
  const dateStr = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set';
  const timeStr = event.start_time && event.end_time ? 
    `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}` : 'Time not set';
  
  // Format venues
  const venuesStr = event.venues && event.venues.length > 0 ? 
    event.venues.join(' + ') : 'No venues';
  
  // Basic event details
  let details = `${event.name} (${event.event_code})\n`;
  details += `Type: ${event.event_type}\n`;
  details += `Date: ${dateStr}\n`;
  details += `Time: ${timeStr}\n`;
  details += `Venue: ${venuesStr}\n`;
  details += `Pax: ${event.pax || 'Not specified'}\n\n`;
  
  // Contact details based on event type
  if (event.event_type === 'Wedding') {
    if (event.primary_name) {
      details += `Bride: ${event.primary_name}`;
      if (event.primary_email) details += ` - ${event.primary_email}`;
      if (event.primary_phone) details += ` - ${event.primary_phone}`;
      details += '\n';
    }
    
    if (event.secondary_name) {
      details += `Groom: ${event.secondary_name}`;
      if (event.secondary_email) details += ` - ${event.secondary_email}`;
      if (event.secondary_phone) details += ` - ${event.secondary_phone}`;
      details += '\n';
    }
  } else {
    if (event.company) {
      details += `Company: ${event.company}`;
      if (event.vat_number) details += ` - VAT: ${event.vat_number}`;
      details += '\n';
    }
    
    if (event.primary_name) {
      details += `Contact: ${event.primary_name}`;
      if (event.primary_email) details += ` - ${event.primary_email}`;
      if (event.primary_phone) details += ` - ${event.primary_phone}`;
      details += '\n';
    }
  }
  
  // Address
  if (event.address) {
    details += `Address: ${event.address}\n`;
  }
  
  return details;
};
