import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventMenu } from './menuFormatters.ts';
import { formatEventDetails } from './eventFormatters.ts';
import { handleEventQuestion } from './questionHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getWelcomeMessage = async () => {
  const today = new Date().toISOString();
  
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      event_venues (
        venues (
          id,
          name
        )
      )
    `)
    .gte('event_date', today)
    .is('deleted_at', null)
    .order('event_date', { ascending: true })
    .limit(10);

  if (!events?.length) {
    return {
      type: 'text',
      message: "Welcome! There are no upcoming events at the moment."
    };
  }

  const validEvents = events.filter(event => 
    event && 
    event.event_date && 
    event.name &&
    new Date(event.event_date) >= new Date(today)
  );

  if (!validEvents.length) {
    return {
      type: 'text',
      message: "Welcome! There are no upcoming events at the moment."
    };
  }

  const sections = validEvents.map(event => ({
    id: event.event_code,
    title: truncateTitle(event.name),
    description: formatEventDate(event.event_date)
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
        text: 'Select an event to view details or ask me a question about any event!'
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
    .is('deleted_at', null)
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
• Send 'menu' to view event menus
• Select an event to view its details
• Ask any question about an event (e.g., "What's the menu for Wedding XYZ?")
• Send 'help' to see this message again`
  };
};

export const handleMessage = async (messageText: string) => {
  const lowercaseMessage = messageText.toLowerCase().trim();
  
  if (['hi', 'hello', 'hey'].includes(lowercaseMessage)) {
    return await getWelcomeMessage();
  } 
  
  if (lowercaseMessage === 'help') {
    return getHelpMessage();
  }
  
  // Try to handle it as a question about an event
  return await handleEventQuestion(messageText);
};

const formatEventDate = (dateStr: string | null) => {
  if (!dateStr) return 'Date not set';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long'
  });
};

const truncateTitle = (title: string) => {
  const maxLength = 24;
  return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';
};