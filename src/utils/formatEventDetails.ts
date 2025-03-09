
import type { Event } from "@/types/event";
import { format } from "date-fns";

export const formatEventDetails = (event: Event) => {
  const venuesText = event.venues && event.venues.length > 0
    ? `Venues: ${event.venues.join(', ')}`
    : 'No venues specified';

  let details = `Event: ${event.name}
Type: ${event.event_type}
Date: ${event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set'}
Time: ${event.start_time || 'Time not set'} - ${event.end_time || ''}
Guests: ${event.pax || 'Not specified'}
${venuesText}
`;

  if (event.event_type === 'Wedding' && event.wedding_details) {
    details += `\nBride: ${event.wedding_details.bride_name || 'Not specified'}
Bride Contact: ${event.wedding_details.bride_email || ''} ${event.wedding_details.bride_mobile || ''}
Groom: ${event.wedding_details.groom_name || 'Not specified'}
Groom Contact: ${event.wedding_details.groom_email || ''} ${event.wedding_details.groom_mobile || ''}`;
  } else if (event.corporate_details) {
    details += `\nCompany: ${event.corporate_details.company_name || 'Not specified'}
Contact Person: ${event.corporate_details.contact_person || 'Not specified'}
Contact Details: ${event.corporate_details.contact_email || ''} ${event.corporate_details.contact_mobile || ''}`;
  }

  return details;
};
