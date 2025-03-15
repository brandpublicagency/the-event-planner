
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventMenu } from '../menuFormatters.ts';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

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
        getMenuTypeSummary(event.menu_selections);

      return [...acc, {
        id: `menu_${event.event_code}`,
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
    const formattedMenu = formatEventMenu(menu);

    // Add button to update canape selections if this is a canape menu
    if (menu.starter_type === 'canapes' || menu.canape_package) {
      return {
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: formattedMenu
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: `update_canapes_${event.event_code}`,
                  title: 'Update Canapés'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: `event_${event.event_code}`,
                  title: 'Back to Event'
                }
              }
            ]
          }
        }
      };
    }

    return {
      type: 'text',
      message: formattedMenu
    };
  } catch (error) {
    console.error('Error in getEventMenuDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching menu details. Please try again later."
    };
  }
};

// Helper function to get a summary of the menu type
function getMenuTypeSummary(menu: any): string {
  if (menu.is_custom) return 'Custom Menu';
  if (menu.starter_type === 'canapes') return 'Canapés Menu';
  if (menu.main_course_type === 'buffet') return 'Buffet Menu';
  if (menu.main_course_type === 'plated') return 'Plated Menu';
  if (menu.main_course_type === 'karoo') return 'Karoo Menu';
  return menu.starter_type || menu.main_course_type || 'Menu TBC';
}
