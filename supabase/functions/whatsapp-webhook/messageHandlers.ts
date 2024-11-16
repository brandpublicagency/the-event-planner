import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getEventDetails(eventCode: string) {
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      menu_selections (
        is_custom,
        custom_menu_details,
        starter_type,
        canape_package,
        canape_selections,
        plated_starter,
        notes
      )
    `)
    .eq('event_code', eventCode)
    .single();

  if (error) throw error;
  if (!event) return "Event not found.";

  const menuInfo = event.menu_selections?.[0] 
    ? `Menu Type: ${event.menu_selections[0].is_custom ? 'Custom Menu' : event.menu_selections[0].starter_type || 'Not set'}\n` +
      (event.menu_selections[0].is_custom ? `Custom Details: ${event.menu_selections[0].custom_menu_details || 'None'}\n` : '') +
      (event.menu_selections[0].starter_type === 'canapes' ? `Canapé Package: ${event.menu_selections[0].canape_package || 'Not set'}\n` : '') +
      (event.menu_selections[0].plated_starter ? `Plated Starter: ${event.menu_selections[0].plated_starter}\n` : '')
    : "No menu selected\n";

  return `Event: ${event.name}
Date: ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Not set'}
Time: ${event.start_time || 'Not set'} - ${event.end_time || 'Not set'}
Type: ${event.event_type}
Guests: ${event.pax || 'Not set'}
${menuInfo}`;
}

export async function updateEventMenu(eventCode: string, menuType: string) {
  let updates = {};
  
  switch (menuType.toLowerCase()) {
    case 'harvest':
      updates = {
        is_custom: false,
        starter_type: 'harvest',
        custom_menu_details: null,
        canape_package: null,
        canape_selections: null,
        plated_starter: null
      };
      break;
    case 'custom':
      updates = {
        is_custom: true,
        starter_type: null,
        custom_menu_details: '',
        canape_package: null,
        canape_selections: null,
        plated_starter: null
      };
      break;
    default:
      return "Invalid menu type. Available options: harvest, custom";
  }

  const { error } = await supabase
    .from('menu_selections')
    .upsert({
      event_code: eventCode,
      ...updates
    });

  if (error) throw error;
  return `Menu updated successfully for ${eventCode}! New menu type: ${menuType}`;
}

export async function getNextEvent() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1);

  if (error) throw error;
  if (!events || events.length === 0) return "No upcoming events found.";

  const event = events[0];
  return `Next event: ${event.name} on ${format(new Date(event.event_date), 'dd MMM yyyy')} (${event.event_type})`;
}

export function getHelpMessage(): string {
  return `👋 Hello! I'm your event assistant. Here's what I can help you with:

1️⃣ View Next Event
   Send: "next event"

2️⃣ View Event Details
   Send: "EVENT-123456" (replace with your event code)

3️⃣ Update Menu Type
   Send: "EVENT-123456 menu harvest"
   or: "EVENT-123456 menu custom"

Need help? Just send "help" anytime!`;
}