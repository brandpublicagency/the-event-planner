
import { format } from 'https://esm.sh/date-fns@3.6.0';

export interface NotificationTemplate {
  type: string;
  title: string;
  description_template: string;
  action_type: string | null;
}

export interface Event {
  event_code: string;
  name: string;
  event_type: string;
  primary_name: string | null;
  event_date: string | null;
}

/**
 * Process template placeholders with event data
 */
export function processTemplate(template: NotificationTemplate, event: Event): string {
  let description = template.description_template;
  
  description = description.replace(/{event_name}/g, event.name || 'Untitled Event');
  description = description.replace(/{event_type}/g, event.event_type || 'Event');
  description = description.replace(/{primary_contact}/g, event.primary_name || 'Client');
  
  if (event.event_date && description.includes('{event_date}')) {
    try {
      const formattedDate = format(new Date(event.event_date), 'dd MMMM yyyy');
      description = description.replace(/{event_date}/g, formattedDate);
    } catch (error) {
      console.error('Error formatting event date:', error);
      description = description.replace(/{event_date}/g, event.event_date || 'upcoming date');
    }
  } else {
    description = description.replace(/{event_date}/g, 'upcoming date');
  }
  
  return description;
}
