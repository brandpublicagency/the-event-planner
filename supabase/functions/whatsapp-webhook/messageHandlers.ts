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

const formatMainCourseSection = (menu: any) => {
  let mainSection = '';

  // Buffet Menu
  if (menu.main_course_type === 'buffet') {
    mainSection = `*Main Course - Buffet Menu*\n`;
    if (menu.buffet_meat_selections?.length) {
      mainSection += `\n*Meat Selections:*\n${menu.buffet_meat_selections.map(item => formatMenuSelection(item)).join('\n')}`;
    }
    if (menu.buffet_vegetable_selections?.length) {
      mainSection += `\n\n*Vegetable Selections:*\n${menu.buffet_vegetable_selections.map(item => formatMenuSelection(item)).join('\n')}`;
    }
    if (menu.buffet_starch_selections?.length) {
      mainSection += `\n\n*Starch Selections:*\n${menu.buffet_starch_selections.map(item => formatMenuSelection(item)).join('\n')}`;
    }
    if (menu.buffet_salad_selection) {
      mainSection += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.buffet_salad_selection)}`;
    }
  }
  
  // Karoo Feast Menu
  else if (menu.main_course_type === 'karoo') {
    mainSection = `*Main Course - Karoo Feast*\n`;
    if (menu.karoo_meat_selection) {
      mainSection += `\n*Meat Selection:*\n${formatMenuSelection(menu.karoo_meat_selection)}`;
    }
    if (menu.karoo_vegetable_selections?.length) {
      mainSection += `\n\n*Vegetable Selections:*\n${menu.karoo_vegetable_selections.map(item => formatMenuSelection(item)).join('\n')}`;
    }
    if (menu.karoo_starch_selection) {
      mainSection += `\n\n*Starch Selection:*\n${formatMenuSelection(menu.karoo_starch_selection)}`;
    }
    if (menu.karoo_salad_selection) {
      mainSection += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.karoo_salad_selection)}`;
    }
  }
  
  // Plated Menu
  else if (menu.main_course_type === 'plated') {
    mainSection = `*Main Course - Plated Menu*\n`;
    if (menu.plated_main_selection) {
      mainSection += `\n*Main Selection:*\n${formatMenuSelection(menu.plated_main_selection)}`;
    }
    if (menu.plated_salad_selection) {
      mainSection += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.plated_salad_selection)}`;
    }
  }

  return mainSection;
};

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

    // Format Main Course section with all menu types
    const mainSection = formatMainCourseSection(menu);

    // Format Dessert section
    const dessertSection = `\n*Dessert*
${menu.dessert_type ? formatMenuSelection(menu.dessert_type) : 'Not selected'}`;

    menuDetails = `\n\n${starterSection}\n\n${mainSection}${dessertSection}`;
  }

  const message = `*Event Details*

${event.name}
${event.event_date ? formatDate(event.event_date) : 'Date not specified'}${event.start_time ? ` • ${event.start_time}` : ''}
*Pax: ${event.pax || 'Not specified'}* / ${event.event_type}
${venues}${menuDetails}`;

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