import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

interface Event {
  event_code: string;
  name: string;
  event_type: string;
  event_date: string;
  pax?: number;
  start_time?: string;
  end_time?: string;
  event_venues?: Array<{
    venues?: {
      name?: string;
    };
  }>;
  menu_selections?: {
    is_custom: boolean;
    starter_type?: string;
    main_course_type?: string;
    dessert_type?: string;
    custom_menu_details?: string;
  };
}

export const formatEventDetails = (event: Event): string => {
  const date = event.event_date ? format(new Date(event.event_date), "d MMMM yyyy") : 'Date TBC';
  const time = event.start_time 
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : 'Time TBC';
  const venue = event.event_venues?.[0]?.venues?.name || 'Venue TBC';

  return `${event.name}
Type: ${event.event_type}
Date: ${date}
Time: ${time}
Venue: ${venue}
Guests: ${event.pax || 'TBC'}
Event Code: ${event.event_code}`;
};

export const formatEventMenu = (event: Event): string => {
  if (!event.menu_selections) {
    return 'No menu selected for this event.';
  }

  const menu = event.menu_selections;
  let menuText = `Menu Details for ${event.name}\n`;
  menuText += `Date: ${format(new Date(event.event_date), "d MMMM yyyy")}\n\n`;

  if (menu.is_custom) {
    menuText += 'Custom Menu\n';
    if (menu.custom_menu_details) {
      menuText += menu.custom_menu_details;
    }
    return menuText;
  }

  menuText += `Starter: ${menu.starter_type || 'Not selected'}\n`;
  menuText += `Main Course: ${menu.main_course_type || 'Not selected'}\n`;
  menuText += `Dessert: ${menu.dessert_type || 'Not selected'}`;

  return menuText;
};