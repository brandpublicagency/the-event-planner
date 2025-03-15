
/**
 * Formats a single event for context display
 */
export const formatEventForContext = (event: any): string => {
  if (!event) return '';
  
  const eventDate = event.event_date 
    ? new Date(event.event_date).toLocaleDateString() 
    : 'No date set';
  
  const venue = Array.isArray(event.venues) && event.venues.length > 0
    ? event.venues.join(', ')
    : (event.venues || 'No venue set');
    
  return `[${event.event_code}] ${event.name} - ${eventDate} - Venue: ${venue}, Guests: ${event.pax || 'Unknown'}`;
};

/**
 * Prepares events context for AI
 */
export const prepareEventsContext = (events: any[] = []): string => {
  if (!events || events.length === 0) {
    return 'No events found.';
  }
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.event_date) return 1;
    if (!b.event_date) return -1;
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });
  
  let eventsContext = `EVENTS (${events.length} total):\n`;
  
  const upcomingEvents = sortedEvents.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  
  // Add upcoming events first
  if (upcomingEvents.length > 0) {
    eventsContext += `\nUPCOMING EVENTS (${upcomingEvents.length}):\n`;
    upcomingEvents.slice(0, 10).forEach((event, index) => {
      eventsContext += `${index + 1}. ${formatEventForContext(event)}\n`;
    });
    
    if (upcomingEvents.length > 10) {
      eventsContext += `... and ${upcomingEvents.length - 10} more upcoming events.\n`;
    }
  } else {
    eventsContext += "\nNo upcoming events found.\n";
  }
  
  return eventsContext;
};
