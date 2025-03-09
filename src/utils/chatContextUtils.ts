
import { Event } from "@/types/event";

export function formatEventForContext(event: Event) {
  const formattedEvent = {
    event_code: event.event_code,
    name: event.name,
    event_type: event.event_type,
    date: event.event_date,
    time: event.start_time ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}` : null,
    pax: event.pax,
    venue: event.venues?.join(', '),
    description: event.description,
    status: event.completed ? 'Completed' : 'Upcoming',
  };

  // Add contact information based on event type
  let contactInfo = {};
  
  if (event.event_type === 'Wedding') {
    contactInfo = {
      bride: event.primary_name,
      bride_email: event.primary_email,
      bride_phone: event.primary_phone,
      groom: event.secondary_name,
      groom_email: event.secondary_email,
      groom_phone: event.secondary_phone,
    };
  } else {
    contactInfo = {
      company: event.company,
      vat_number: event.vat_number,
      contact_person: event.primary_name,
      contact_email: event.primary_email,
      contact_phone: event.primary_phone,
    };
  }

  // Add address
  const addressInfo = {
    address: event.address || event.client_address,
  };

  return {
    ...formattedEvent,
    ...contactInfo,
    ...addressInfo
  };
}
