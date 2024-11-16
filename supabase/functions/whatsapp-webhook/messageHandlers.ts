import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventMenu } from './menuFormatters.ts';
import { formatEventDetails } from './eventFormatters.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getWelcomeMessage = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(10);

  if (!events?.length) {
    return {
      type: 'text',
      message: "Welcome! There are no upcoming events at the moment."
    };
  }

  const sections = events.map(event => ({
    id: event.event_code,
    title: formatEventTitle(event)
  }));

  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Welcome! Here are the upcoming events:'
      },
      body: {
        text: 'Select an event to view details'
      },
      action: {
        button: 'View Events',
        sections: [{
          rows: sections
        }]
      }
    }
  };
};

export const getEventDetails = async (eventCode: string) => {
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      wedding_details (*),
      corporate_details (*),
      menu_selections (*),
      event_venues (
        venues (
          name
        )
      )
    `)
    .eq('event_code', eventCode)
    .single();

  if (!event) {
    return {
      type: 'text',
      message: "Event not found."
    };
  }

  const message = formatEventDetails(event);

  return {
    type: 'text',
    message
  };
};

export const getHelpMessage = () => {
  return {
    type: 'text',
    message: `*Available Commands*
• Send 'hi' or 'hello' to view upcoming events
• Select an event to view its details
• Send 'help' to see this message again`
  };
};

const formatEventTitle = (event: any) => {
  const date = event.event_date ? new Date(event.event_date) : new Date();
  const formattedDate = date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const title = `${event.name} (${formattedDate})`;
  return title.length <= 24 ? title : title.substring(0, 21) + '...';
};