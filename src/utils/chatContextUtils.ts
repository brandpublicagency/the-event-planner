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

    const menuDetails = event.menu_selections ? formatMenuDetails(event.menu_selections) : 'No menu selected';
    const clientDetails = formatClientDetails(event);

    return `Event: ${event.name}
Date: ${formattedDate}
Venue: ${venues}
Pax: ${event.pax || 'Not specified'}
Type: ${event.event_type}
Event Code: ${event.event_code}

Client Details:
${clientDetails}

Menu Details:
${menuDetails}`;
  }).join('\n\n');
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

You can provide detailed information about:
- Event details including dates, venues, and client information
- Complete menu selections including starters, main courses, and desserts
- Specific menu items and their details
- Client contact information and preferences
- Venue information and logistics

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
