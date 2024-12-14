import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const formatEventDetails = (event: any) => {
  try {
    if (!event) return "Event details not available";

    const venues = event.event_venues
      ?.map((ev: any) => ev.venues?.name)
      .filter(Boolean)
      .join(', ') || 'No venue specified';

    const date = event.event_date ? format(new Date(event.event_date), 'MMMM d, yyyy') : 'Date not set';
    
    let clientDetails = '';
    if (event.wedding_details?.bride_name || event.wedding_details?.groom_name) {
      clientDetails = `\nBride: ${event.wedding_details.bride_name || 'Not specified'}
Groom: ${event.wedding_details.groom_name || 'Not specified'}`;
    } else if (event.corporate_details?.company_name) {
      clientDetails = `\nCompany: ${event.corporate_details.company_name}`;
    }

    const menuDetails = event.menu_selections ? `\nMenu:
- Type: ${event.menu_selections.is_custom ? 'Custom' : 'Standard'}
- Starter: ${event.menu_selections.starter_type || 'Not selected'}
- Main: ${event.menu_selections.main_course_type || 'Not selected'}
- Dessert: ${event.menu_selections.dessert_type || 'Not selected'}` : '';

    return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
Venue: ${venues}
Pax: ${event.pax || 'Not specified'}${clientDetails}${menuDetails}`;

  } catch (error) {
    console.error('Error formatting event details:', error);
    return "Error formatting event details";
  }
};