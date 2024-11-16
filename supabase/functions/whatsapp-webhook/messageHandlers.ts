import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://esm.sh/date-fns@2.30.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getEventDetails(eventCode: string) {
  console.log('Fetching event details for:', eventCode);
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      menu_selections (*)
    `)
    .eq('event_code', eventCode)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw new Error(`Could not find event ${eventCode}`);
  }
  
  if (!event) {
    return `Event ${eventCode} not found.`;
  }

  const menuInfo = event.menu_selections 
    ? `Menu Type: ${event.menu_selections.is_custom ? 'Custom Menu' : event.menu_selections.starter_type || 'Not set'}\n` +
      (event.menu_selections.is_custom ? `Custom Details: ${event.menu_selections.custom_menu_details || 'None'}\n` : '') +
      (event.menu_selections.starter_type === 'canapes' ? `Canapé Package: ${event.menu_selections.canape_package || 'Not set'}\n` : '') +
      (event.menu_selections.plated_starter ? `Plated Starter: ${event.menu_selections.plated_starter}\n` : '')
    : "No menu selected\n";

  return `📅 Event Details:
Name: ${event.name}
Date: ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Not set'}
Time: ${event.start_time || 'Not set'} - ${event.end_time || 'Not set'}
Type: ${event.event_type}
Guests: ${event.pax || 'Not set'}

🍽️ Menu Information:
${menuInfo}`;
}

export async function updateEventMenu(eventCode: string, menuType: string) {
  console.log('Updating menu for event:', eventCode, 'to type:', menuType);
  
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
      return "❌ Invalid menu type. Available options: harvest, custom";
  }

  const { error } = await supabase
    .from('menu_selections')
    .upsert({
      event_code: eventCode,
      ...updates
    });

  if (error) {
    console.error('Error updating menu:', error);
    throw new Error(`Failed to update menu for ${eventCode}`);
  }
  
  return `✅ Menu updated successfully for ${eventCode}!\nNew menu type: ${menuType}`;
}

export async function getNextEvent() {
  console.log('Fetching next event');
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching next event:', error);
    throw new Error('Failed to fetch next event');
  }

  if (!events || events.length === 0) {
    return "📅 No upcoming events found.";
  }

  const event = events[0];
  return `📅 Next Event:
${event.name}
Date: ${format(new Date(event.event_date), 'dd MMM yyyy')}
Type: ${event.event_type}`;
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