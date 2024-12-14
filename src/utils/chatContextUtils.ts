import type { Event } from "@/types/event";
import { format, isFuture, parseISO, compareAsc } from "date-fns";

export const prepareEventsContext = (events: Event[] = []) => {
  // Sort events by date and filter out past events
  const sortedFutureEvents = events
    .filter(event => event.event_date && isFuture(parseISO(event.event_date)))
    .sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return compareAsc(parseISO(a.event_date), parseISO(b.event_date));
    });

  const pastEvents = events
    .filter(event => event.event_date && !isFuture(parseISO(event.event_date)))
    .sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return compareAsc(parseISO(b.event_date), parseISO(a.event_date));
    });

  const eventsContext = sortedFutureEvents.map(formatEventDetails).join('\n\n');
  const pastEventsContext = pastEvents.length > 0 
    ? `\n\nPast Events:\n${pastEvents.map(formatEventDetails).join('\n\n')}`
    : '';

  return `Current and Upcoming Events:\n${eventsContext}${pastEventsContext}`;
};

const formatEventDetails = (event: Event) => {
  const venues = event.event_venues
    ?.map(ev => ev.venues?.name)
    .filter(Boolean)
    .join(' + ') || 'No venue';
  
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'dd MMMM yyyy')
    : 'Date not set';

  const formattedTime = event.start_time 
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : 'Time not set';

  const menuDetails = event.menu_selections ? formatMenuDetails(event.menu_selections) : 'No menu selected';
  const clientDetails = formatClientDetails(event);

  return `Event: ${event.name}
Date: ${formattedDate}
Time: ${formattedTime}
Venue: ${venues}
Type: ${event.event_type}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}
Status: ${event.completed ? 'Completed' : 'Active'}

Client Details:
${clientDetails}

Menu Details:
${menuDetails}`;
};

const formatClientDetails = (event: Event) => {
  if (event.wedding_details) {
    return `Bride: ${event.wedding_details.bride_name || 'Not specified'}
Bride Contact: ${event.wedding_details.bride_email || 'Not specified'} / ${event.wedding_details.bride_mobile || 'Not specified'}
Groom: ${event.wedding_details.groom_name || 'Not specified'}
Groom Contact: ${event.wedding_details.groom_email || 'Not specified'} / ${event.wedding_details.groom_mobile || 'Not specified'}`;
  }
  
  if (event.corporate_details) {
    return `Company: ${event.corporate_details.company_name || 'Not specified'}
Contact Person: ${event.corporate_details.contact_person || 'Not specified'}
Contact: ${event.corporate_details.contact_email || 'Not specified'} / ${event.corporate_details.contact_mobile || 'Not specified'}
VAT: ${event.corporate_details.company_vat || 'Not specified'}`;
  }

  return 'No client details available';
};

const formatMenuDetails = (menu: any) => {
  const sections = [];
  
  if (menu.is_custom) {
    sections.push('Custom Menu:', menu.custom_menu_details);
  } else {
    // Starter Section
    if (menu.starter_type === 'canapes') {
      sections.push('Starter: Canapes');
      if (menu.canape_package) sections.push(`Package: ${formatSelection(menu.canape_package)}`);
      if (menu.canape_selections?.length) {
        sections.push('Selected Canapes:', menu.canape_selections.map(formatSelection).join('\n'));
      }
    } else if (menu.starter_type === 'plated') {
      sections.push('Starter: Plated');
      if (menu.plated_starter) sections.push(`Selection: ${formatSelection(menu.plated_starter)}`);
    }

    // Main Course Section
    if (menu.main_course_type) {
      sections.push(`\nMain Course: ${formatSelection(menu.main_course_type)}`);
      
      if (menu.main_course_type === 'buffet') {
        if (menu.buffet_meat_selections?.length) {
          sections.push('Meat Selections:', menu.buffet_meat_selections.map(formatSelection).join('\n'));
        }
        if (menu.buffet_vegetable_selections?.length) {
          sections.push('Vegetable Selections:', menu.buffet_vegetable_selections.map(formatSelection).join('\n'));
        }
        if (menu.buffet_starch_selections?.length) {
          sections.push('Starch Selections:', menu.buffet_starch_selections.map(formatSelection).join('\n'));
        }
        if (menu.buffet_salad_selection) {
          sections.push('Salad:', formatSelection(menu.buffet_salad_selection));
        }
      } else if (menu.main_course_type === 'karoo') {
        if (menu.karoo_meat_selection) {
          sections.push('Meat Selection:', formatSelection(menu.karoo_meat_selection));
        }
        if (menu.karoo_vegetable_selections?.length) {
          sections.push('Vegetable Selections:', menu.karoo_vegetable_selections.map(formatSelection).join('\n'));
        }
        if (menu.karoo_starch_selection?.length) {
          sections.push('Starch Selections:', menu.karoo_starch_selection.map(formatSelection).join('\n'));
        }
        if (menu.karoo_salad_selection) {
          sections.push('Salad:', formatSelection(menu.karoo_salad_selection));
        }
      } else if (menu.main_course_type === 'plated') {
        if (menu.plated_main_selection) {
          sections.push('Main Selection:', formatSelection(menu.plated_main_selection));
        }
        if (menu.plated_salad_selection) {
          sections.push('Salad:', formatSelection(menu.plated_salad_selection));
        }
      }
    }

    // Dessert Section
    if (menu.dessert_type) {
      sections.push(`\nDessert: ${formatSelection(menu.dessert_type)}`);
      if (menu.traditional_dessert) {
        sections.push('Traditional Dessert:', formatSelection(menu.traditional_dessert));
      }
      if (menu.dessert_canapes?.length) {
        sections.push('Dessert Canapes:', menu.dessert_canapes.map(formatSelection).join('\n'));
      }
      if (menu.individual_cakes?.length) {
        sections.push('Individual Cakes:', menu.individual_cakes.map(formatSelection).join('\n'));
      }
    }

    // Other Selections
    if (menu.other_selections?.length) {
      sections.push('\nOther Selections:');
      menu.other_selections.forEach((selection: string) => {
        const quantity = menu.other_selections_quantities?.[selection] || 0;
        sections.push(`${formatSelection(selection)} - Quantity: ${quantity}`);
      });
    }

    // Notes
    if (menu.notes) {
      sections.push('\nNotes:', menu.notes);
    }
  }
  
  return sections.join('\n');
};

const formatSelection = (selection: string) => {
  return selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getSystemMessage = (eventsContext: string, pdfContext: string) => {
  return {
    role: "system" as const,
    content: `You are an expert event planning assistant with comprehensive access to and control over the entire event management system. You can help with all aspects of event management including creating, updating, and managing events, tasks, and settings.

Available Information:
${eventsContext || 'No events found.'}

Document Knowledge Base:
${pdfContext || 'No documents available.'}

Your capabilities include:
1. Event Management
   - View all events (past and upcoming)
   - Create new events
   - Update existing events
   - Delete events
   - Manage event details, venues, and schedules

2. Menu Management
   - View and modify menu selections
   - Update catering details
   - Handle special dietary requirements

3. Task Management
   - Create and assign tasks
   - Update task status
   - Set task priorities
   - Track task completion

4. Client Communication
   - Send emails to clients
   - Update client information
   - Handle client requests

5. Document Management
   - Access event documents
   - Process PDF content
   - Generate reports

You can perform actions by responding with specific JSON formats:

1. For menu updates:
{
  "action": "update_menu",
  "event_code": "EVENT-CODE",
  "menu_updates": {
    "starter_type": "type",
    "is_custom": false,
    "notes": "Additional notes"
  }
}

2. For sending emails:
{
  "action": "send_email",
  "to": ["recipient@email.com"],
  "subject": "Subject",
  "content": "Email content"
}

3. For creating/updating events:
{
  "action": "update_event",
  "event_code": "EVENT-CODE",
  "updates": {
    "name": "Event Name",
    "event_date": "2024-03-20",
    "pax": 100
  }
}

When asked about events:
- Always prioritize upcoming events over past events
- For "next event" queries, return the closest future event
- Include relevant details like date, time, venue, and status
- Mention if an event has passed or is upcoming

Respond naturally and conversationally while maintaining accurate information about events, tasks, and system status.`
  };
};
