import type { Event } from "@/types/event";
import { format } from "date-fns";

export const prepareEventsContext = (events: Event[] = []) => {
  return events.map(event => {
    const venues = event.event_venues
      ?.map(ev => ev.venues?.name)
      .filter(Boolean)
      .join(' + ') || 'No venue';
    
    const formattedDate = event.event_date 
      ? format(new Date(event.event_date), 'dd MMMM')
      : 'Date not set';

    return `${event.name}
${formattedDate}
${event.pax || 0} Pax in the ${venues}

Event Code: ${event.event_code}
Type: ${event.event_type}
${event.menu_selections ? formatMenuDetails(event.menu_selections) : 'No menu selected'}`;
  }).join('\n\n');
};

const formatMenuDetails = (menu: any) => {
  const sections = [];
  
  if (menu.is_custom) {
    sections.push('Custom Menu:', menu.custom_menu_details);
  } else {
    if (menu.starter_type) sections.push(`Starter: ${menu.starter_type}`);
    if (menu.main_course_type) sections.push(`Main Course: ${menu.main_course_type}`);
    if (menu.dessert_type) sections.push(`Dessert: ${menu.dessert_type}`);
  }
  
  return sections.length > 0 ? '\n' + sections.join('\n') : '';
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