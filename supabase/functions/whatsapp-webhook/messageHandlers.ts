import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const truncateTitle = (title: string, maxLength = 24) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const formatMenuSelection = (selection: string) => {
  return selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getWelcomeMessage = async () => {
  const { data: events } = await supabase
    .from('events')
    .select('*')
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
    title: truncateTitle(`${event.name} (${formatDate(event.event_date)})`)
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

  let clientDetails = '';
  if (event.wedding_details?.bride_name || event.wedding_details?.groom_name) {
    clientDetails = `*Bride:* ${event.wedding_details.bride_name || 'Not specified'}
*Groom:* ${event.wedding_details.groom_name || 'Not specified'}\n`;
  } else if (event.corporate_details?.company_name || event.corporate_details?.contact_person) {
    clientDetails = `*Company:* ${event.corporate_details.company_name || 'Not specified'}
*Contact:* ${event.corporate_details.contact_person || 'Not specified'}\n`;
  }

  const venues = event.event_venues
    ?.map(ev => ev.venues?.name)
    .filter(Boolean)
    .join(' + ') || 'No venues';

  let menuDetails = '';
  if (event.menu_selections) {
    const menu = event.menu_selections;
    
    // Format Arrival & Starter section
    const starterSection = menu.is_custom ? '*Custom Menu*' : 
      `*Arrival & Starter*
${menu.starter_type ? formatMenuSelection(menu.starter_type) : 'Not selected'}`;

    // Format Main Course section
    const mainSection = `*Menu*
${menu.plated_main_selection ? formatMenuSelection(menu.plated_main_selection) : ''}
${menu.buffet_meat_selections?.length ? `\n*Meat Selections:*\n${menu.buffet_meat_selections.map(item => formatMenuSelection(item)).join('\n')}` : ''}
${menu.buffet_vegetable_selections?.length ? `\n*Vegetable Selections:*\n${menu.buffet_vegetable_selections.map(item => formatMenuSelection(item)).join('\n')}` : ''}
${menu.buffet_starch_selections?.length ? `\n*Starch Selections:*\n${menu.buffet_starch_selections.map(item => formatMenuSelection(item)).join('\n')}` : ''}
${menu.buffet_salad_selection ? `\n*Salad Selection:*\n${formatMenuSelection(menu.buffet_salad_selection)}` : ''}`;

    // Format Dessert section
    const dessertSection = `*Dessert*
${menu.dessert_type ? formatMenuSelection(menu.dessert_type) : 'Not selected'}`;

    menuDetails = `\n\nMenu Information:\n\n${starterSection}\n\n${mainSection}\n\n${dessertSection}`;
  }

  const message = `*Event Details*

${event.name}
${event.event_date ? formatDate(event.event_date) : 'Date not specified'}${event.start_time ? ` • ${event.start_time}` : ''}
*Pax: ${event.pax || 'Not specified'}* / ${event.event_type}
${venues}

${clientDetails}${menuDetails}`;

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