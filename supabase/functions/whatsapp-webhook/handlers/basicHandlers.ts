
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';

// Initialize Supabase client for direct queries if needed
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Handles basic command messages like greetings, help, test
 */
export const handleBasicCommands = async (messageText: string): Promise<WhatsAppResponse | null> => {
  // Basic greetings
  if (['hi', 'hello', 'hey', 'hallo', 'howdy', 'greetings'].includes(messageText)) {
    try {
      return await getWelcomeMessage();
    } catch (error) {
      console.error('Error getting welcome message:', error);
      return {
        type: 'text',
        message: "Hello! I'm your event assistant. How can I help you today?"
      };
    }
  }

  // Help command
  if (messageText === 'help' || messageText === 'commands') {
    return getHelpMessage();
  }

  // Test command
  if (messageText === 'test') {
    return {
      type: 'text',
      message: "I'm working correctly! You can ask me about events, tasks, or type 'help' for more commands."
    };
  }
  
  return null; // No basic command matched
};

/**
 * Handles direct event queries like "next event" or "events"
 */
export const handleDirectEventQueries = async (messageText: string): Promise<WhatsAppResponse | null> => {
  // Events commands
  if (messageText.match(/^(events|upcoming events|show events|list events)$/i)) {
    try {
      console.log('Attempting fallback events query');
      const today = new Date();
      const { data: events, error: dbError } = await supabase
        .from('events')
        .select(`
          name, event_date, event_type, pax,
          event_venues (
            venues (
              name
            )
          )
        `)
        .gte('event_date', today.toISOString())
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
        .limit(5);
          
      if (dbError) throw dbError;
        
      if (!events || events.length === 0) {
        return {
          type: 'text',
          message: "I couldn't find any upcoming events."
        };
      }
        
      const eventsList = events.map(event => {
        const date = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
        
        // Get venue info
        let venueInfo = '';
        if (event.event_venues && Array.isArray(event.event_venues)) {
          const venueNames = event.event_venues
            .map((v: any) => v.venues?.name)
            .filter(Boolean);
          if (venueNames.length > 0) {
            venueInfo = ` at ${venueNames.join(', ')}`;
          }
        }
        
        return `• ${event.name} - ${date} (${event.event_type})${venueInfo}`;
      }).join('\n');
        
      return {
        type: 'text',
        message: `Upcoming events:\n\n${eventsList}`
      };
    } catch (fallbackError) {
      console.error('Error in fallback events query:', fallbackError);
      return {
        type: 'text',
        message: "I'm having trouble accessing the events database right now. Please try again in a moment."
      };
    }
  }

  // Next event command
  if (messageText.match(/^(next event|next|upcoming event)$/i)) {
    try {
      console.log('Attempting fallback next event query');
      const today = new Date();
      const { data: events, error: dbError } = await supabase
        .from('events')
        .select(`
          name, event_date, event_type, pax,
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .gte('event_date', today.toISOString())
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
        .limit(1);
          
      if (dbError) throw dbError;
        
      if (!events || events.length === 0) {
        return {
          type: 'text',
          message: "I couldn't find any upcoming events."
        };
      }
        
      const event = events[0];
      const date = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
      
      // Get venue info
      let venueInfo = '';
      if (event.event_venues && Array.isArray(event.event_venues)) {
        const venueNames = event.event_venues
          .map((v: any) => v.venues?.name)
          .filter(Boolean);
        if (venueNames.length > 0) {
          venueInfo = ` at ${venueNames.join(', ')}`;
        }
      }
      
      // Get menu info if available
      let menuInfo = '';
      if (event.menu_selections) {
        const menuType = event.menu_selections.main_course_type || 
                        (event.menu_selections.is_custom ? 'Custom menu' : '');
        if (menuType) {
          menuInfo = `\nMenu: ${menuType}`;
        }
      }
        
      return {
        type: 'text',
        message: `Next event: ${event.name}\nDate: ${date}\nType: ${event.event_type}\nGuests: ${event.pax || 'Not specified'}${venueInfo}${menuInfo}`
      };
    } catch (fallbackError) {
      console.error('Error in fallback next event query:', fallbackError);
      return {
        type: 'text',
        message: "I'm having trouble accessing the next event information. Please try again later."
      };
    }
  }
  
  return null; // No event query matched
};

/**
 * Handles tasks queries
 */
export const handleTasksQueries = async (messageText: string): Promise<WhatsAppResponse | null> => {
  if (messageText.match(/^(tasks|todo|to do|to-do|task list)$/i)) {
    try {
      console.log('Attempting fallback tasks query');
      const { data: tasks, error: dbError } = await supabase
        .from('tasks')
        .select('title, status, due_date, priority')
        .eq('completed', false)
        .order('due_date', { ascending: true })
        .limit(5);
          
      if (dbError) throw dbError;
        
      if (!tasks || tasks.length === 0) {
        return {
          type: 'text',
          message: "You have no pending tasks. Great job!"
        };
      }
        
      const tasksList = tasks.map(task => {
        const dueDate = task.due_date ? format(new Date(task.due_date), "MMMM d, yyyy") : 'No due date';
        return `• ${task.title} - ${task.status.toUpperCase()} (Due: ${dueDate})`;
      }).join('\n');
        
      return {
        type: 'text',
        message: `Your tasks:\n\n${tasksList}`
      };
    } catch (fallbackError) {
      console.error('Error in fallback tasks query:', fallbackError);
      return {
        type: 'text',
        message: "I'm having trouble accessing the tasks database. Please try again shortly."
      };
    }
  }
  
  return null; // No task query matched
};

/**
 * Handles menu-related queries
 */
export const handleMenuQueries = async (messageText: string): Promise<WhatsAppResponse | null> => {
  if (messageText.toLowerCase().includes('menu') || 
      messageText.toLowerCase().includes('catering') ||
      messageText.toLowerCase().includes('food')) {
    try {
      console.log('Fetching menu information');
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          name, event_date, event_type,
          menu_selections (*)
        `)
        .gte('event_date', new Date().toISOString())
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
        .limit(3);

      if (error) throw error;

      if (!events?.length) {
        return {
          type: 'text',
          message: "No upcoming events with menus found."
        };
      }

      const menusList = events
        .map(event => {
          const eventMenu = event.menu_selections;
          let menuInfo = 'No menu selected';
          
          if (eventMenu) {
            if (eventMenu.is_custom) {
              menuInfo = 'Custom Menu';
              if (eventMenu.custom_menu_details) {
                menuInfo += `\n${eventMenu.custom_menu_details}`;
              }
            } else {
              // Format menu based on type
              const parts = [];
              
              if (eventMenu.starter_type === 'canapes' || eventMenu.canape_package) {
                parts.push(`Starter: Canapés (${eventMenu.canape_package || 'Package not specified'})`);
                
                if (eventMenu.canape_selections && eventMenu.canape_selections.length > 0) {
                  parts.push(`Selected canapés: ${eventMenu.canape_selections.join(', ')}`);
                }
              } else if (eventMenu.starter_type) {
                parts.push(`Starter: ${eventMenu.starter_type}`);
              }
              
              if (eventMenu.main_course_type) {
                parts.push(`Main: ${eventMenu.main_course_type}`);
              }
              
              if (eventMenu.dessert_type) {
                parts.push(`Dessert: ${eventMenu.dessert_type}`);
              }
              
              menuInfo = parts.join('\n');
            }
          }
          
          return `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')} - ${event.name}\n🍽️ ${menuInfo}`;
        })
        .join('\n\n');

      return {
        type: 'text',
        message: `Upcoming Event Menus:\n\n${menusList}`
      };
    } catch (error) {
      console.error('Error in menu query handler:', error);
      return {
        type: 'text',
        message: "Sorry, I couldn't retrieve menu information. Please try again later."
      };
    }
  }
  
  return null; // No menu query matched
};
