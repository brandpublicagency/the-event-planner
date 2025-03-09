
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface WhatsAppMessage {
  type: string;
  text?: {
    body: string;
  };
  interactive?: any;
}

export const handleMessage = async (message: WhatsAppMessage) => {
  try {
    if (message.type === 'text') {
      const messageText = message.text?.body.toLowerCase().trim() || '';

      // Handle greetings
      if (['hi', 'hello', 'hey', 'hallo'].includes(messageText)) {
        return {
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: 'Welcome to Warm Karoo!'
            },
            body: {
              text: 'Please select an option from the menu:'
            },
            action: {
              button: 'View Options',
              sections: [{
                title: 'Event Management',
                rows: [
                  { 
                    id: 'upcoming_events', 
                    title: 'Upcoming Events',
                    description: 'View all upcoming events'
                  },
                  { 
                    id: 'todo_list', 
                    title: 'Your To-do List',
                    description: 'View your pending tasks'
                  },
                  {
                    id: 'next_event',
                    title: 'Next Event',
                    description: 'View details about your next upcoming event'
                  }
                ]
              }]
            }
          }
        };
      }

      // Handle next event query specifically
      if (messageText.includes('next event')) {
        try {
          const { data: nextEvent, error } = await supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString())
            .is('deleted_at', null)
            .is('completed', false)
            .order('event_date', { ascending: true })
            .limit(1);

          if (error) {
            console.error('Error fetching next event:', error);
            throw error;
          }

          if (!nextEvent?.length) {
            return {
              type: 'text',
              message: "No upcoming events found."
            };
          }

          const event = nextEvent[0];
          return {
            type: 'text',
            message: `The next event is "${event.name}" on ${format(new Date(event.event_date), 'MMMM d, yyyy')}. It's a ${event.event_type} event${event.pax ? ` for ${event.pax} guests` : ''}.`
          };
        } catch (error) {
          console.error('Error in next event handler:', error);
          return {
            type: 'text',
            message: "Sorry, I couldn't retrieve information about your next event. Please try again later."
          };
        }
      }

      // Handle upcoming events query
      if (messageText.includes('upcoming events') || messageText.includes('events')) {
        try {
          const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString())
            .is('deleted_at', null)
            .order('event_date', { ascending: true })
            .limit(5);

          if (error) throw error;

          if (!events?.length) {
            return {
              type: 'text',
              message: "No upcoming events found."
            };
          }

          const eventsList = events
            .map(event => `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')} - ${event.name} (${event.event_type})`)
            .join('\n');

          return {
            type: 'text',
            message: `Upcoming Events:\n\n${eventsList}`
          };
        } catch (error) {
          console.error('Error in upcoming events handler:', error);
          return {
            type: 'text',
            message: "Sorry, I couldn't retrieve your upcoming events. Please try again later."
          };
        }
      }

      // Handle tasks query
      if (messageText.includes('tasks') || messageText.includes('todo') || messageText.includes('to-do')) {
        try {
          const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('completed', false)
            .order('due_date', { ascending: true })
            .limit(5);

          if (error) throw error;

          if (!tasks?.length) {
            return {
              type: 'text',
              message: "No pending tasks found."
            };
          }

          const tasksList = tasks
            .map(task => {
              const dueDate = task.due_date ? 
                ` (Due: ${format(new Date(task.due_date), 'dd MMM yyyy')})` :
                ' (No due date)';
              
              return `📋 ${task.title}${dueDate} - ${task.status.toUpperCase()}`;
            })
            .join('\n');

          return {
            type: 'text',
            message: `Your Pending Tasks:\n\n${tasksList}`
          };
        } catch (error) {
          console.error('Error in tasks handler:', error);
          return {
            type: 'text',
            message: "Sorry, I couldn't retrieve your tasks. Please try again later."
          };
        }
      }

      // Handle menu query
      if (messageText.includes('menu') || messageText.includes('menus')) {
        try {
          const { data: events, error } = await supabase
            .from('events')
            .select('*')
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

          const { data: menuSelections } = await supabase
            .from('menu_selections')
            .select('*')
            .in('event_code', events.map(e => e.event_code));

          const menusList = events
            .map(event => {
              const eventMenu = menuSelections?.find(m => m.event_code === event.event_code);
              const menuType = eventMenu ? 
                (eventMenu.is_custom ? 'Custom Menu' : `${eventMenu.main_course_type || 'Menu'} menu`) : 
                'No menu selected';
              
              return `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')} - ${event.name}\n🍽️ ${menuType}`;
            })
            .join('\n\n');

          return {
            type: 'text',
            message: `Upcoming Event Menus:\n\n${menusList}`
          };
        } catch (error) {
          console.error('Error in menus handler:', error);
          return {
            type: 'text',
            message: "Sorry, I couldn't retrieve menu information. Please try again later."
          };
        }
      }

      // Help command
      if (messageText.includes('help')) {
        return {
          type: 'text',
          message: "Here are some things you can ask me about:\n\n• 'events' - See upcoming events\n• 'next event' - Details about the next event\n• 'tasks' or 'todo' - View your pending tasks\n• 'menus' - See menu details for upcoming events\n• 'help' - Show this help message"
        };
      }

      // Default response
      return {
        type: 'text',
        message: "I can help you with managing events and tasks. Try asking about upcoming events, your next event, to-do list, or menus. Type 'help' for more options."
      };
    }

    return {
      type: 'text',
      message: "I'm not sure how to handle that type of message. Please try typing your question or type 'help' for available commands."
    };
  } catch (error) {
    console.error('Error handling message:', error);
    return {
      type: 'text',
      message: "I encountered an error processing your request. Please try again later."
    };
  }
};
