import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://esm.sh/date-fns@2.30.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export async function getWelcomeMessage() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch upcoming events');
    }

    if (!events || events.length === 0) {
      return { 
        type: 'text',
        message: "No upcoming events found." 
      };
    }

    const sections = [{
      title: "Upcoming Events",
      rows: events.map(event => ({
        id: event.event_code,
        title: truncateText(event.name, 24),
        description: event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set'
      }))
    }];

    return {
      type: 'interactive',
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "Event Management"
        },
        body: {
          text: "Here are your upcoming events. Select one to view or manage:"
        },
        footer: {
          text: "Choose an event from the list"
        },
        action: {
          button: "View Events",
          sections: sections
        }
      }
    };
  } catch (error) {
    console.error('Error in getWelcomeMessage:', error);
    return {
      type: 'text',
      message: "Sorry, I encountered an error. Please try again later."
    };
  }
}

export async function getEventDetails(eventCode: string) {
  try {
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

    const menuInfo = event.menu_selections 
      ? `Menu Type: ${event.menu_selections.is_custom ? 'Custom Menu' : event.menu_selections.starter_type || 'Not set'}\n` +
        (event.menu_selections.is_custom ? `Custom Details: ${event.menu_selections.custom_menu_details || 'None'}\n` : '') +
        (event.menu_selections.starter_type === 'canapes' ? `Canapé Package: ${event.menu_selections.canape_package || 'Not set'}\n` : '') +
        (event.menu_selections.plated_starter ? `Plated Starter: ${event.menu_selections.plated_starter}\n` : '')
      : "No menu selected\n";

    return {
      type: 'text',
      message: `📅 Event Details:
Name: ${event.name}
Date: ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Not set'}
Type: ${event.event_type}
Guests: ${event.pax || 'Not set'}

🍽️ Menu Information:
${menuInfo}

To update the menu, send:
"menu ${event.event_code} harvest" or
"menu ${event.event_code} custom"`
    };
  } catch (error) {
    console.error('Error in getEventDetails:', error);
    return {
      type: 'text',
      message: "Sorry, I couldn't retrieve the event details. Please try again."
    };
  }
}

export function getHelpMessage() {
  return {
    type: 'text',
    message: `👋 Hello! I'm your event assistant. Here's what I can help you with:

1️⃣ View Events List
   Send: "hi" or "hello"

2️⃣ View Event Details
   Select an event from the list

3️⃣ Update Menu Type
   After selecting an event, you can update its menu

Need help? Just send "help" anytime!`
  };
}