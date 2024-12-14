import { format } from "date-fns";
import type { Event } from "@/types/event";

const formatEventDateTime = (event: Event) => {
  const date = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set';
  const startTime = event.start_time || 'Start time not set';
  const endTime = event.end_time || 'End time not set';
  return { 
    date,
    time: `${startTime} - ${endTime}`,
    fullDateTime: `${date} at ${startTime}${event.end_time ? ` - ${endTime}` : ''}`
  };
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
    const { date, time, fullDateTime } = formatEventDateTime(event);
    const venues = formatVenues(event);
    const clientInfo = formatClientDetails(event);
    
    return `Event: ${event.name}
Type: ${clientInfo.type}
Client: ${clientInfo.details}
Schedule: ${fullDateTime}
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
1. When asked about time, provide the specific time (e.g., "The event starts at 14:00 and ends at 17:00")
2. When asked about dates, provide the full date (e.g., "The event is on 15 March 2024")
3. When asked about schedule, provide both date and time (e.g., "The event is scheduled for 15 March 2024 at 14:00")
4. For weddings, always include the couple's full names
5. For corporate events, include the company name
6. Always mention venue information when relevant
7. If information isn't available, clearly state what's missing
8. Keep responses concise but complete
9. Use a friendly, professional tone

Remember:
- Distinguish between time and date queries
- Provide exact times when specifically asked about timing
- If asked about an event that doesn't exist, politely indicate that you can't find it
- For follow-up questions about the same event, maintain context`
  };
};