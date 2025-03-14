import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { handleListSelection } from './listHandler.ts';
import { getNextEvent, getUpcomingEventsList } from './event/index.ts';
import { getTodoList } from './task/index.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout, handleTimeoutError, WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { checkDatabaseConnection } from '../utils/dataFetcher/index.ts';

// Initialize Supabase client for direct queries if needed
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Main handler for all incoming WhatsApp messages
 */
export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message type:', message.type);

    // First check database connection
    let dbConnected = false;
    try {
      dbConnected = await withTimeout(
        checkDatabaseConnection(),
        'Database connection check',
        5000
      );
    } catch (dbError) {
      console.error('Error or timeout checking database connection:', dbError);
      // Continue anyway - we'll handle specific operations carefully
    }

    if (!dbConnected) {
      console.warn('Database connection check failed - proceeding with caution');
    }

    // Handle interactive messages (list or button selections)
    if (message.interactive) {
      console.log('Processing interactive message:', message.interactive.type);
      
      try {
        // Handle list replies
        if (message.interactive.list_reply) {
          const id = message.interactive.list_reply.id;
          console.log('List selection ID:', id);
          return await withTimeout(
            handleListSelection(id),
            'List selection',
            20000
          );
        }

        // Handle button replies
        if (message.interactive.button_reply) {
          const id = message.interactive.button_reply.id;
          console.log('Button selection ID:', id);
          return await withTimeout(
            handleListSelection(id),
            'Button selection',
            20000
          );
        }
      } catch (error) {
        console.error('Error handling interactive message:', error);
        return {
          type: 'text',
          message: "I couldn't process that selection. Please try again or type 'help' for available commands."
        };
      }

      // Fallback for unrecognized interactive type
      return {
        type: 'text',
        message: "I couldn't understand that selection. Please try again."
      };
    }

    // Handle text messages
    if (message.text?.body) {
      const messageText = message.text.body.toLowerCase().trim();
      console.log('Processing text message:', messageText);

      // Basic greetings
      if (['hi', 'hello', 'hey', 'hallo', 'howdy', 'greetings'].includes(messageText)) {
        try {
          return await withTimeout(
            getWelcomeMessage(),
            'Welcome message',
            5000
          );
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

      // Events commands
      if (messageText.match(/^(events|upcoming events|show events|list events)$/i)) {
        console.log('Processing events query');
        try {
          return await withTimeout(
            getUpcomingEventsList(),
            'Upcoming events query',
            20000
          );
        } catch (error) {
          console.error('Error getting upcoming events list:', error);
          
          // Fallback to a simple direct query
          try {
            console.log('Attempting fallback events query');
            const today = new Date();
            const { data: events, error: dbError } = await supabase
              .from('events')
              .select('name, event_date, event_type, pax')
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
              return `• ${event.name} - ${date} (${event.event_type})`;
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
      }

      // Next event command
      if (messageText.match(/^(next event|next|upcoming event)$/i)) {
        console.log('Processing next event query');
        try {
          return await withTimeout(
            getNextEvent(),
            'Next event query',
            20000
          );
        } catch (error) {
          console.error('Error getting next event:', error);
          
          // Fallback to simple direct query
          try {
            console.log('Attempting fallback next event query');
            const today = new Date();
            const { data: events, error: dbError } = await supabase
              .from('events')
              .select('name, event_date, event_type, pax')
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
            
            return {
              type: 'text',
              message: `Next event: ${event.name}\nDate: ${date}\nType: ${event.event_type}\nGuests: ${event.pax || 'Not specified'}`
            };
          } catch (fallbackError) {
            console.error('Error in fallback next event query:', fallbackError);
            return {
              type: 'text',
              message: "I'm having trouble accessing the next event information. Please try again later."
            };
          }
        }
      }

      // Tasks commands
      if (messageText.match(/^(tasks|todo|to do|to-do|task list)$/i)) {
        console.log('Processing tasks query');
        try {
          return await withTimeout(
            getTodoList(),
            'Tasks query',
            20000
          );
        } catch (error) {
          console.error('Error getting todo list:', error);
          
          // Fallback to simple direct query
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
      }

      // For other text messages, provide a helpful response
      return {
        type: 'text',
        message: "I'm not sure how to respond to that. Type 'help' to see available commands or try asking about events or tasks."
      };
    }

    // Handle unknown message types
    console.warn('Unrecognized message format:', JSON.stringify(message, null, 2));
    return {
      type: 'text',
      message: "I couldn't understand that message. Please try again or type 'help' for available commands."
    };
  } catch (error) {
    console.error('Unhandled error in handleMessage:', {
      message: error.message,
      stack: error.stack
    });
    
    return {
      type: 'text',
      message: "I encountered an unexpected error. Please try again or use a more specific command like 'events' or 'tasks'."
    };
  }
};