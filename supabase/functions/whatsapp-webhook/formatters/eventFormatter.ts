

import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const formatEventDetails = (event: any) => {
  if (!event) return "Event not found";
  
  try {
    // Extract venue information
    const venues = event.event_venues
      ?.map((ev: any) => ev.venues?.name)
      .filter(Boolean)
      .join(' + ') || 'No venues';

    // Format client details based on event type
    let clientDetails = '';
    if (event.wedding_details?.bride_name || event.wedding_details?.groom_name) {
      clientDetails = `*Bride:* ${event.wedding_details.bride_name || 'Not specified'}
*Groom:* ${event.wedding_details.groom_name || 'Not specified'}\n`;
    } else if (event.corporate_details?.company_name || event.corporate_details?.contact_person) {
      clientDetails = `*Company:* ${event.corporate_details.company_name || 'Not specified'}
*Contact:* ${event.corporate_details.contact_person || 'Not specified'}\n`;
    } else if (event.primary_name) {
      clientDetails = `*Contact:* ${event.primary_name || 'Not specified'}\n`;
    }

    const formattedDate = event.event_date ? formatDate(event.event_date) : 'Date not specified';
    
    // Import menu formatter function only if we have menu selections
    let menuDetails = '';
    if (event.menu_selections) {
      try {
        const { formatEventMenu } = require('../menuFormatters.ts');
        menuDetails = formatEventMenu(event.menu_selections);
      } catch (error) {
        console.error('Error formatting menu:', error);
        menuDetails = '\n\n*Menu:* Available (select "View Menu" for details)';
      }
    }

    return `*Event Details*

${event.name}
${formattedDate}${event.start_time ? ` • ${event.start_time}` : ''}
*Pax: ${event.pax || 'Not specified'}* / ${event.event_type}
${venues}
${clientDetails}${menuDetails ? `\n\n${menuDetails}` : ''}`;
  } catch (error) {
    console.error('Error in formatEventDetails:', error);
    return `*Event: ${event.name || 'Unknown'}*

Unable to format all event details. Please try viewing specific sections or contact support.`;
  }
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "MMMM d, yyyy");
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr || 'Date not specified';
  }
};
