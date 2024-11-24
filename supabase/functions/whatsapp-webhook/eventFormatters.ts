import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { formatMenuSelection, formatMainCourseSection } from './menuFormatters.ts';

export const formatEventDetails = (event: any) => {
  const venues = event.event_venues
    ?.map((ev: any) => ev.venues?.name)
    .filter(Boolean)
    .join(' + ') || 'No venues';

  let clientDetails = '';
  if (event.wedding_details?.bride_name || event.wedding_details?.groom_name) {
    clientDetails = `*Bride:* ${event.wedding_details.bride_name || 'Not specified'}
*Groom:* ${event.wedding_details.groom_name || 'Not specified'}\n`;
  } else if (event.corporate_details?.company_name || event.corporate_details?.contact_person) {
    clientDetails = `*Company:* ${event.corporate_details.company_name || 'Not specified'}
*Contact:* ${event.corporate_details.contact_person || 'Not specified'}\n`;
  }

  const formattedDate = event.event_date ? formatDate(event.event_date) : 'Date not specified';
  const menuDetails = event.menu_selections ? formatMenuDetails(event.menu_selections) : '';

  return `*Event Details*

${event.name}
${formattedDate}${event.start_time ? ` • ${event.start_time}` : ''}
*Pax: ${event.pax || 'Not specified'}* / ${event.event_type}
${venues}${menuDetails}`;
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "MMMM d, yyyy");
  } catch {
    return dateStr;
  }
};

const formatMenuDetails = (menu: any) => {
  if (!menu) return '';

  const starterSection = menu.is_custom ? '*Custom Menu*' : 
    `*Arrival & Starter*
${menu.starter_type ? formatMenuSelection(menu.starter_type) : 'Not selected'}`;

  const dessertSection = `\n*Dessert*
${menu.dessert_type ? formatMenuSelection(menu.dessert_type) : 'Not selected'}`;

  return `\n\n${starterSection}\n\n${formatMainCourseSection(menu)}${dessertSection}`;
};