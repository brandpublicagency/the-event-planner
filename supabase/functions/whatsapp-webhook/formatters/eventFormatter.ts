import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

interface Event {
  event_code: string;
  name: string;
  event_type: string;
  event_date: string;
  pax?: number;
  start_time?: string;
  end_time?: string;
  wedding_details?: {
    bride_name?: string;
    groom_name?: string;
  };
  corporate_details?: {
    company_name?: string;
    contact_person?: string;
  };
  event_venues?: Array<{
    venues?: {
      name?: string;
    };
  }>;
}

export const formatEventDetails = (event: Event): string => {
  const date = event.event_date ? format(new Date(event.event_date), "d MMMM yyyy") : 'Date TBC';
  const time = event.start_time 
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : 'Time TBC';
  const venue = event.event_venues?.[0]?.venues?.name || 'Venue TBC';

  let clientDetails = '';
  if (event.event_type === 'wedding' && event.wedding_details) {
    clientDetails = `\nBride: ${event.wedding_details.bride_name || 'TBC'}
Groom: ${event.wedding_details.groom_name || 'TBC'}`;
  } else if (event.event_type === 'corporate' && event.corporate_details) {
    clientDetails = `\nCompany: ${event.corporate_details.company_name || 'TBC'}
Contact: ${event.corporate_details.contact_person || 'TBC'}`;
  }

  return `${event.name}
Type: ${event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
Date: ${date}
Time: ${time}
Venue: ${venue}
Guests: ${event.pax || 'TBC'}${clientDetails}
Event Code: ${event.event_code}`;
};