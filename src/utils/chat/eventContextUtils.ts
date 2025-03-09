
import { Event } from "@/types/event";
import { format } from "date-fns";

/**
 * Formats an event object into a structured format for chat context
 */
export function formatEventForContext(event: Event) {
  // Extract venue information from event_venues if it exists
  const venues = event.venues ? event.venues.join(', ') : 
                (event.event_venues && Array.isArray(event.event_venues)) ? 
                  event.event_venues
                    .map((v) => v.venues?.name)
                    .filter(Boolean)
                    .join(', ') : 
                  'No venue specified';

  const formattedEvent = {
    event_code: event.event_code,
    name: event.name,
    event_type: event.event_type,
    date: event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Date not set',
    time: event.start_time ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}` : 'Time not set',
    pax: event.pax || 'Not specified',
    venue: venues,
    description: event.description || 'No description',
    status: event.completed ? 'Completed' : 'Upcoming',
  };

  // Add contact information based on event type
  let contactInfo = {};
  
  if (event.event_type === 'Wedding') {
    contactInfo = {
      bride: event.primary_name || 'Not specified',
      bride_email: event.primary_email || 'Not specified',
      bride_phone: event.primary_phone || 'Not specified',
      groom: event.secondary_name || 'Not specified',
      groom_email: event.secondary_email || 'Not specified',
      groom_phone: event.secondary_phone || 'Not specified',
    };
  } else {
    contactInfo = {
      company: event.company || 'Not specified',
      vat_number: event.vat_number || 'Not specified',
      contact_person: event.primary_name || 'Not specified',
      contact_email: event.primary_email || 'Not specified',
      contact_phone: event.primary_phone || 'Not specified',
    };
  }

  // Add address
  const addressInfo = {
    address: event.address || 'Not specified',
  };

  // Add menu information if available
  let menuInfo = {};
  if (event.menu_selections) {
    menuInfo = {
      menu_type: event.menu_selections.is_custom ? 'Custom Menu' : 'Standard Menu',
      starter: event.menu_selections.starter_type || 'Not selected',
      main_course: event.menu_selections.main_course_type || 'Not selected',
      dessert: event.menu_selections.dessert_type || 'Not selected',
    };
  }

  return {
    ...formattedEvent,
    ...contactInfo,
    ...addressInfo,
    ...menuInfo
  };
}

/**
 * Prepares events context data for the AI assistant
 */
export function prepareEventsContext(events: Event[]) {
  if (!events || events.length === 0) {
    return "No events found.";
  }

  // Split into upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate >= today;
  });
  
  const pastEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate < today;
  });

  let eventsContext = '';
  
  // Format upcoming events
  if (upcomingEvents.length > 0) {
    eventsContext += "UPCOMING EVENTS:\n";
    eventsContext += upcomingEvents.map(event => {
      const formattedEvent = formatEventForContext(event);
      return `Event: ${JSON.stringify(formattedEvent, null, 2)}`;
    }).join('\n\n');
  } else {
    eventsContext += "No upcoming events found.\n";
  }
  
  // Only include past events if there are any
  if (pastEvents.length > 0) {
    eventsContext += "\n\nPAST EVENTS (Limited Info):\n";
    eventsContext += pastEvents.slice(0, 5).map(event => {
      return `Event: ${event.name} (${event.event_code}), Date: ${event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Not set'}, Type: ${event.event_type}`;
    }).join('\n');
    
    if (pastEvents.length > 5) {
      eventsContext += `\n...and ${pastEvents.length - 5} more past events`;
    }
  }
  
  return eventsContext;
}
