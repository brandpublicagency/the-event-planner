import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { formatEventMenu } from './menuFormatters.ts';
import { formatEventDetails } from './eventFormatters.ts';
import { handleEventQuestion } from './questionHandler.ts';
import { getTaskDetails, getUpcomingEventsList, getWelcomeMessage } from './menuHandlers.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handleMessage = async (messageText: string) => {
  console.log('Handling message:', messageText);
  
  try {
    const lowercaseMessage = messageText.toLowerCase().trim();
    
    // Handle greetings
    if (['hi', 'hello', 'hey'].includes(lowercaseMessage)) {
      return await getWelcomeMessage();
    }

    // Handle menu selections
    if (['upcoming_events', 'event_menus', 'tasks', 'calendar'].includes(lowercaseMessage)) {
      switch (lowercaseMessage) {
        case 'upcoming_events':
          return await getUpcomingEventsList();
        case 'tasks':
          return await getTaskDetails();
        case 'calendar':
          return await getCalendarView();
        case 'help':
          return getHelpMessage();
      }
    }

    // Handle natural language questions about events
    if (lowercaseMessage.includes('event') || 
        lowercaseMessage.includes('when') || 
        lowercaseMessage.includes('next') ||
        lowercaseMessage.includes('menu')) {
      return await handleEventQuestion(messageText);
    }
    
    // Default to welcome message if no other matches
    return await getWelcomeMessage();
  } catch (error) {
    console.error('Error in handleMessage:', error);
    return {
      type: 'text',
      message: "I encountered an error processing your request. Please try again or type 'help' for available commands."
    };
  }
};

export const getEventDetails = async (eventCode: string) => {
  console.log('Fetching event details for:', eventCode);
  
  try {
    if (!eventCode) {
      console.error('Invalid event code provided:', eventCode);
      return {
        type: 'text',
        message: "Sorry, I couldn't find the event you're looking for."
      };
    }

    const { data: event, error } = await supabase
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
        ),
        tasks (
          id,
          title,
          completed,
          due_date,
          priority,
          status
        )
      `)
      .eq('event_code', eventCode)
      .is('deleted_at', null)
      .is('completed', false)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return {
        type: 'text',
        message: "Error fetching event details. Please try again later."
      };
    }

    if (!event) {
      return {
        type: 'text',
        message: "Event not found."
      };
    }

    const message = formatEventDetails(event);
    const tasks = event.tasks || [];
    const tasksSummary = tasks.length > 0 
      ? `\n\n*Related Tasks:*\n${tasks.map(task => 
        `• ${task.title} (${task.status.toUpperCase()})`).join('\n')}`
      : '';

    return {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: message + tasksSummary
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: `menu_${event.event_code}`,
                title: 'View Menu'
              }
            },
            {
              type: 'reply',
              reply: {
                id: `tasks_${event.event_code}`,
                title: 'View Tasks'
              }
            }
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error in getEventDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching event details. Please try again later."
    };
  }
};

const getCalendarView = async () => {
  try {
    const today = new Date();
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching calendar events:', error);
      return {
        type: 'text',
        message: "Error fetching calendar events. Please try again later."
      };
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events in the calendar."
      };
    }

    const message = "*Upcoming Calendar Events:*\n\n" + events.map(event => 
      `📅 ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Date TBD'}\n${event.name}\n${
        event.event_type
      } (${event.event_code})`
    ).join('\n\n');

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getCalendarView:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching calendar events. Please try again later."
    };
  }
};

export const getHelpMessage = () => {
  return {
    type: 'text',
    message: `*Available Commands*
• Send 'hi' or 'hello' to see main menu
• Send 'events' to view upcoming events
• Send 'menu' to view event menus
• Send 'tasks' to view recent tasks
• Send 'calendar' to view upcoming calendar
• Ask any question about events or tasks
• Send 'help' to see this message again`
  };
};