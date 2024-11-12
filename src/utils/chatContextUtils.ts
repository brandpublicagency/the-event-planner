import type { Event } from "@/types/event";

export const prepareEventsContext = (events: Event[] = []) => {
  return events.map(event => {
    const venue = event.event_venues?.[0]?.venues?.name || 'No venue specified';
    const date = new Date(event.event_date).toLocaleDateString();
    
    let details = '';
    if (event.wedding_details) {
      details = `Wedding: ${event.wedding_details.bride_name} & ${event.wedding_details.groom_name}`;
    } else if (event.corporate_details) {
      details = `Corporate: ${event.corporate_details.company_name}`;
    }

    const menuInfo = event.menu_selections 
      ? `Menu: ${event.menu_selections.is_custom ? 'Custom Menu' : `${event.menu_selections.starter_type || ''} ${event.menu_selections.plated_starter || ''}`}`
      : 'No menu selected';

    return `Event: ${event.name} (${event.event_type})
Date: ${date}
Venue: ${venue}
Details: ${details}
${menuInfo}
Pax: ${event.pax}
Event Code: ${event.event_code}`;
  }).join('\n\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext: string) => {
  return {
    role: "system" as const,
    content: `You are an expert event planning assistant with access to the following information:

1. Upcoming Events:
${eventsContext || 'No upcoming events found.'}

2. Document Knowledge Base:
${pdfContext || 'No documents available.'}

Your role is to help with:
1. Event Planning & Management
2. Schedule Coordination
3. Venue Information
4. Client Details
5. Menu Planning and Selection
6. Best Practices & Guidelines

You can update menu selections for events. To update a menu, respond with a JSON object in this format:
{
  "action": "update_menu",
  "event_code": "EVENT-CODE",
  "menu_updates": {
    "starter_type": "harvest",
    "plated_starter": "soup",
    "is_custom": false,
    "custom_menu_details": null,
    "canape_package": null,
    "canape_selections": null,
    "notes": "Additional notes here"
  }
}

You can also send emails to clients when needed. To send an email, respond with a JSON object in this format:
{
  "action": "send_email",
  "to": ["recipient@email.com"],
  "subject": "Email subject",
  "content": "Email content in HTML format"
}`
  };
};