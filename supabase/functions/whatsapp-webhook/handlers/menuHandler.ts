
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventMenu } from '../menuFormatters.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getEventMenusList = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        menu_selections (*)
      `)
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events with menus found."
      };
    }

    const sections = events.reduce((acc: any[], event) => {
      if (!event.menu_selections) return acc;
      
      const date = format(new Date(event.event_date), 'dd MMM yyyy');
      const menuType = event.menu_selections.is_custom ? 'Custom Menu' : 
        `${event.menu_selections.starter_type || ''} ${event.menu_selections.main_course_type || ''}`.trim() || 'Menu TBC';

      return [...acc, {
        id: `event_${event.event_code}`,
        title: event.name,
        description: `📅 ${date}\n🍽️ ${menuType}\n👥 ${event.pax || 'TBC'} guests`
      }];
    }, []);

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Event Menus'
        },
        body: {
          text: `Select an event to view its menu details:`
        },
        action: {
          button: 'View Menus',
          sections: [{
            title: '🍽️ Events with Menus',
            rows: sections
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getEventMenusList:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching event menus. Please try again later."
    };
  }
};

export const getEventMenuDetails = async (eventCode: string) => {
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
      console.error('Error fetching event menu:', error);
      throw error;
    }

    if (!event || !event.menu_selections) {
      return {
        type: 'text',
        message: "No menu found for this event."
      };
    }

    const menu = event.menu_selections;
    const message = `*Menu Details for ${event.name}*

Type: ${menu.is_custom ? 'Custom Menu' : 'Standard Menu'}
${menu.custom_menu_details ? `Custom Details: ${menu.custom_menu_details}\n` : ''}
${menu.starter_type ? `Starter: ${menu.starter_type}\n` : ''}
${menu.main_course_type ? `Main Course: ${menu.main_course_type}\n` : ''}
${menu.dessert_type ? `Dessert: ${menu.dessert_type}\n` : ''}
${menu.notes ? `\nNotes: ${menu.notes}` : ''}`;

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getEventMenuDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching menu details. Please try again later."
    };
  }
};
