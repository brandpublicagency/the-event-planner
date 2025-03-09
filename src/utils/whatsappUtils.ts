
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
  console.log('Processing WhatsApp message:', message);
  
  try {
    if (message.type === 'text') {
      const messageText = message.text?.body.toLowerCase().trim() || '';
      console.log('Processing text message:', messageText);

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
          console.log('Fetching next event data');
          const { data: events, error } = await supabase
            .from('events')
            .select(`
              *,
              menu_selections (*),
              event_venues (
                venues (
                  name
                )
              )
            `)
            .gte('event_date', new Date().toISOString())
            .is('deleted_at', null)
            .is('completed', false)
            .order('event_date', { ascending: true })
            .limit(1);

          if (error) {
            console.error('Error fetching next event:', error);
            throw error;
          }

          if (!events?.length) {
            return {
              type: 'text',
              message: "No upcoming events found."
            };
          }

          const event = events[0];
          console.log('Found next event:', event);
          
          // Format the response
          let venueInfo = '';
          if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
            venueInfo = ` at ${event.venues.join(', ')}`;
          } else if (event.event_venues && Array.isArray(event.event_venues)) {
            const venueNames = event.event_venues
              .map((v: any) => v.venues?.name)
              .filter(Boolean);
            if (venueNames.length > 0) {
              venueInfo = ` at ${venueNames.join(', ')}`;
            }
          }
          
          let paxInfo = '';
          if (event.pax) {
            paxInfo = ` for ${event.pax} guests`;
          }
          
          return {
            type: 'text',
            message: `The next event is "${event.name}" on ${format(new Date(event.event_date), 'MMMM d, yyyy')}. It's a ${event.event_type} event${venueInfo}${paxInfo}.`
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
        return await handleUpcomingEvents();
      }

      // Handle tasks query
      if (messageText.includes('tasks') || messageText.includes('todo') || messageText.includes('to-do')) {
        return await handleTasks();
      }

      // Handle menu query
      if (messageText.includes('menu') || messageText.includes('menus')) {
        return await handleMenus();
      }

      // Help command
      if (messageText.includes('help')) {
        return {
          type: 'text',
          message: "Here are some things you can ask me about:\n\n• 'events' - See upcoming events\n• 'next event' - Details about the next event\n• 'tasks' or 'todo' - View your pending tasks\n• 'menus' - See menu details for upcoming events\n• 'help' - Show this help message\n\nYou can also ask me questions in natural language, like 'What events do we have next week?' or 'Can you update the guest count for EVENT-001 to 50?'"
        };
      }

      // Default behavior - route to AI
      console.log('Routing message to AI assistant');
      return {
        type: 'text',
        message: "I'm checking on that for you. Give me one moment..."
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

// Helper functions to handle specific queries
async function handleUpcomingEvents() {
  try {
    console.log('Fetching upcoming events');
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        event_venues (
          venues (
            name
          )
        )
      `)
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
      .map(event => {
        // Get venue info - handle both direct venues array and event_venues relation
        let venueInfo = '';
        if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
          venueInfo = ` at ${event.venues.join(', ')}`;
        } else if (event.event_venues && Array.isArray(event.event_venues)) {
          const venueNames = event.event_venues
            .map((v: any) => v.venues?.name)
            .filter(Boolean);
          if (venueNames.length > 0) {
            venueInfo = ` at ${venueNames.join(', ')}`;
          }
        }
        
        return `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')} - ${event.name} (${event.event_type})${venueInfo}`;
      })
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

async function handleTasks() {
  try {
    console.log('Fetching tasks');
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

async function handleMenus() {
  try {
    console.log('Fetching menu information');
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
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
