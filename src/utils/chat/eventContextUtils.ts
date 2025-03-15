
import { format } from "date-fns";

/**
 * Formats an event object into a readable string for the AI assistant
 */
export function formatEventForContext(event: any) {
  try {
    // Format event date for better readability
    let formattedDate = "No date set";
    if (event.event_date) {
      try {
        formattedDate = format(new Date(event.event_date), 'dd/MM/yyyy');
      } catch (e) {
        console.error('Error formatting date:', e);
        formattedDate = String(event.event_date);
      }
    }
    
    // Format venues
    let venuesInfo = "No venues set";
    if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
      venuesInfo = event.venues.join(", ");
    }
    
    // Format menu selections
    let menuInfo = "No menu information";
    if (event.menu_selections) {
      const menuType = event.menu_selections.main_course_type || 
                      (event.menu_selections.is_custom ? 'Custom menu' : '');
      menuInfo = menuType ? `Menu type: ${menuType}` : "No menu specified";
      
      // Add more details if available
      const details = [];
      if (event.menu_selections.buffet_meat_selections && 
          Array.isArray(event.menu_selections.buffet_meat_selections) && 
          event.menu_selections.buffet_meat_selections.length > 0) {
        details.push(`Meat: ${event.menu_selections.buffet_meat_selections.join(', ')}`);
      }
      
      if (event.menu_selections.buffet_starch_selections && 
          Array.isArray(event.menu_selections.buffet_starch_selections) && 
          event.menu_selections.buffet_starch_selections.length > 0) {
        details.push(`Starch: ${event.menu_selections.buffet_starch_selections.join(', ')}`);
      }
      
      if (event.menu_selections.buffet_vegetable_selections && 
          Array.isArray(event.menu_selections.buffet_vegetable_selections) && 
          event.menu_selections.buffet_vegetable_selections.length > 0) {
        details.push(`Vegetables: ${event.menu_selections.buffet_vegetable_selections.join(', ')}`);
      }
      
      // Add other menu details if available
      if (details.length > 0) {
        menuInfo += ` (${details.join('; ')})`;
      }
      
      // Add notes if available
      if (event.menu_selections.notes) {
        menuInfo += `\nMenu notes: ${event.menu_selections.notes}`;
      }
    }
    
    // Format contact information
    let contactInfo = "No contact information";
    if (event.primary_name || event.primary_email || event.primary_phone) {
      contactInfo = `Primary contact: ${event.primary_name || 'Not specified'}`;
      if (event.primary_email) contactInfo += `, Email: ${event.primary_email}`;
      if (event.primary_phone) contactInfo += `, Phone: ${event.primary_phone}`;
      
      // Add secondary contact if available
      if (event.secondary_name || event.secondary_email || event.secondary_phone) {
        contactInfo += `\nSecondary contact: ${event.secondary_name || 'Not specified'}`;
        if (event.secondary_email) contactInfo += `, Email: ${event.secondary_email}`;
        if (event.secondary_phone) contactInfo += `, Phone: ${event.secondary_phone}`;
      }
    }
    
    // Format company information
    let companyInfo = "No company information";
    if (event.company || event.vat_number || event.address) {
      companyInfo = `Company: ${event.company || 'Not specified'}`;
      if (event.vat_number) companyInfo += `, VAT: ${event.vat_number}`;
      if (event.address) companyInfo += `, Address: ${event.address}`;
    }
    
    // Return a comprehensive event description
    return `EVENT: ${event.name} (${event.event_code})
Type: ${event.event_type}
Date: ${formattedDate}
Guests: ${event.pax || 'Not specified'}
Venues: ${venuesInfo}
Status: ${event.completed ? 'Completed' : 'Active'}
${menuInfo}
${contactInfo}
${companyInfo}
${event.description ? `Description: ${event.description}` : ''}
${event.event_notes ? `Notes: ${event.event_notes}` : ''}`;
  } catch (error) {
    console.error('Error formatting event for context:', error, event);
    return `EVENT: ${event.name || 'Unknown'} (${event.event_code || 'No code'})
Error formatting complete event details. Basic information: 
Type: ${event.event_type || 'Unknown'}
Date: ${event.event_date || 'Unknown'}
Guests: ${event.pax || 'Unknown'}`;
  }
}

/**
 * Prepares events context data for the AI assistant
 */
export function prepareEventsContext(events: any[]) {
  if (!events || events.length === 0) {
    return "No events found.";
  }
  
  const now = new Date();
  
  // Split events into upcoming and past
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return false;
    try {
      const eventDate = new Date(event.event_date);
      return eventDate >= now;
    } catch (e) {
      return false;
    }
  }).sort((a, b) => {
    const dateA = a.event_date ? new Date(a.event_date) : new Date(9999, 11, 31);
    const dateB = b.event_date ? new Date(b.event_date) : new Date(9999, 11, 31);
    return dateA.getTime() - dateB.getTime();
  });
  
  const pastEvents = events.filter(event => {
    if (!event.event_date) return false;
    try {
      const eventDate = new Date(event.event_date);
      return eventDate < now;
    } catch (e) {
      return false;
    }
  }).sort((a, b) => {
    const dateA = a.event_date ? new Date(a.event_date) : new Date(0);
    const dateB = b.event_date ? new Date(b.event_date) : new Date(0);
    return dateB.getTime() - dateA.getTime(); // Reverse sort for past events
  });
  
  const noDateEvents = events.filter(event => !event.event_date);
  
  // Format upcoming events (most important)
  let result = `UPCOMING EVENTS (${upcomingEvents.length}):\n\n`;
  if (upcomingEvents.length > 0) {
    result += upcomingEvents.map(formatEventForContext).join('\n\n');
  } else {
    result += "No upcoming events found.";
  }
  
  // Add events without dates
  if (noDateEvents.length > 0) {
    result += `\n\nEVENTS WITHOUT DATES (${noDateEvents.length}):\n\n`;
    result += noDateEvents.map(formatEventForContext).join('\n\n');
  }
  
  // Add past events (limited to recent ones)
  const recentPastEvents = pastEvents.slice(0, 5);
  if (recentPastEvents.length > 0) {
    result += `\n\nRECENT PAST EVENTS (${recentPastEvents.length}):\n\n`;
    result += recentPastEvents.map(formatEventForContext).join('\n\n');
  }
  
  return result;
}
