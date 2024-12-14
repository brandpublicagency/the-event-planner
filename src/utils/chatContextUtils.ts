import { format } from "date-fns";
import type { Event } from "@/types/event";

const formatEventDateTime = (event: Event) => {
  const date = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set';
  const time = event.start_time 
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : 'Time not set';
  return { date, time };
};

const formatVenues = (event: Event) => {
  return event.event_venues
    ?.map(ev => ev.venues?.name)
    .filter(Boolean)
    .join(' + ') || 'No venue specified';
};

const formatClientDetails = (event: Event) => {
  if (event.wedding_details) {
    return {
      type: 'Wedding',
      details: `Wedding of ${event.wedding_details.bride_name || 'Bride'} & ${event.wedding_details.groom_name || 'Groom'}`,
      contacts: [
        { role: 'Bride', name: event.wedding_details.bride_name, email: event.wedding_details.bride_email, mobile: event.wedding_details.bride_mobile },
        { role: 'Groom', name: event.wedding_details.groom_name, email: event.wedding_details.groom_email, mobile: event.wedding_details.groom_mobile }
      ]
    };
  } else if (event.corporate_details) {
    return {
      type: 'Corporate',
      details: `Corporate event for ${event.corporate_details.company_name || 'Unknown Company'}`,
      contacts: [{
        role: 'Contact Person',
        name: event.corporate_details.contact_person,
        email: event.corporate_details.contact_email,
        mobile: event.corporate_details.contact_mobile
      }]
    };
  }
  return { type: event.event_type, details: 'No specific details available', contacts: [] };
};

export const prepareEventsContext = (events: Event[] = []) => {
  return events.map(event => {
    const { date, time } = formatEventDateTime(event);
    const venues = formatVenues(event);
    const clientInfo = formatClientDetails(event);
    
    return `Event: ${event.name}
Type: ${clientInfo.type}
Client: ${clientInfo.details}
Date: ${date}
Time: ${time}
Venue: ${venues}
Event Code: ${event.event_code}
Status: ${event.completed ? 'Completed' : 'Active'}
Pax: ${event.pax || 'Not specified'}

${clientInfo.contacts.map(contact => 
  `${contact.role}: ${contact.name || 'Not specified'}
Contact: ${contact.email ? `Email: ${contact.email}` : ''}${contact.mobile ? ` | Mobile: ${contact.mobile}` : ''}`
).join('\n')}`;
  }).join('\n\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string) => {
  return {
    role: "system" as const,
    content: `You are an expert event planning assistant with detailed knowledge of all events. Your primary role is to provide accurate, specific information about events and their details.

Available Event Information:
${eventsContext || 'No events found.'}

${pdfContext ? `Additional Documentation:\n${pdfContext}` : ''}

Guidelines for Responses:
1. Be direct and specific when answering questions about events
2. Always include dates and times when asked about scheduling
3. For weddings, include the couple's full names
4. For corporate events, include the company name
5. Always mention venue information when relevant
6. If information isn't available, clearly state what's missing
7. Keep responses concise but complete
8. Use a friendly, professional tone

Remember:
- Provide exact dates, times, and locations when available
- If you're not sure about specific details, acknowledge what you don't know
- For follow-up questions about the same event, maintain context
- If asked about an event that doesn't exist, politely indicate that you can't find it`
  };
};