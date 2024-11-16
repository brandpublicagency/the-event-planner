import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    title: `${event.name} (${event.event_date})`
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
      menu_selections (*)
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
  if (event.wedding_details) {
    clientDetails = `Bride: ${event.wedding_details.bride_name || 'Not specified'}
Groom: ${event.wedding_details.groom_name || 'Not specified'}`;
  } else if (event.corporate_details) {
    clientDetails = `Company: ${event.corporate_details.company_name || 'Not specified'}
Contact: ${event.corporate_details.contact_person || 'Not specified'}`;
  }

  let menuDetails = '';
  if (event.menu_selections) {
    const menu = event.menu_selections;
    
    // Format Arrival & Starter section
    const starterSection = menu.is_custom ? 'Custom Menu' : 
      `*Arrival & Starter:*
${menu.starter_type ? `Type: ${menu.starter_type}` : 'Not selected'}
${menu.canape_package ? `Canapé Package: ${menu.canape_package} canapés` : ''}
${menu.plated_starter ? `Plated Starter: ${menu.plated_starter}` : ''}`;

    // Format Main Course section
    const mainSection = `*Main Course:*
${menu.main_course_type ? `Type: ${menu.main_course_type}` : 'Not selected'}
${menu.plated_main_selection ? `Selection: ${menu.plated_main_selection}` : ''}
${menu.buffet_meat_selections?.length ? `Meat Selections: ${menu.buffet_meat_selections.join(', ')}` : ''}
${menu.buffet_vegetable_selections?.length ? `Vegetable Selections: ${menu.buffet_vegetable_selections.join(', ')}` : ''}
${menu.buffet_starch_selections?.length ? `Starch Selections: ${menu.buffet_starch_selections.join(', ')}` : ''}
${menu.buffet_salad_selection ? `Salad Selection: ${menu.buffet_salad_selection}` : ''}`;

    // Format Dessert section
    const dessertSection = `*Dessert:*
${menu.dessert_type ? `Type: ${menu.dessert_type}` : 'Not selected'}`;

    menuDetails = `\n\n${starterSection}\n\n${mainSection}\n\n${dessertSection}`;
  }

  const message = `*Event Details*
Event: ${event.name}
Date: ${event.event_date || 'Not specified'}
Type: ${event.event_type}
Pax: ${event.pax || 'Not specified'}

${clientDetails}${menuDetails}`;

  return {
    type: 'text',
    message
  };
};

export const getHelpMessage = () => {
  return {
    type: 'text',
    message: `Available commands:
• Send 'hi' or 'hello' to view upcoming events
• Select an event to view its details
• Send 'help' to see this message again`
  };
};