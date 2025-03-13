
import { handleListSelection } from './listHandler.ts';
import { getNextEvent, getUpcomingEventsList } from './event/index.ts';
import { getNextTask, getTodoList } from './task/index.ts';
import { handleAIQuestion } from './question/index.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout, handleTimeoutError, WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { fetchEvents, checkDatabaseConnection, verifyAllRequiredTables } from '../utils/dataFetcher/index.ts';
import { handleError } from '../utils/errorHandler.ts';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message:', JSON.stringify(message, null, 2));

    // First, check database connection
    try {
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        console.error('Database connection check failed');
        return {
          type: 'text',
          message: "I'm having trouble connecting to our database right now. Please try again in a few moments. If the issue persists, please contact support."
        };
      }
      
      // Enhanced check for required tables
      const { success, errorTables } = await verifyAllRequiredTables();
      if (!success) {
        console.warn(`Table verification issues detected: ${errorTables.join(', ')}`);
        // Continue with processing but log the warning
      }
    } catch (dbError) {
      console.error('Error checking database connection:', dbError);
      return {
        type: 'text',
        message: "I'm experiencing some technical difficulties. Please try again shortly."
      };
    }

    // Handle interactive messages (list or button selections)
    if (message.interactive) {
      console.log('Processing interactive message:', {
        type: message.interactive.type,
        data: JSON.stringify(message.interactive, null, 2)
      });
      
      try {
        if (message.interactive.list_reply) {
          return await withTimeout(
            handleListSelection(message.interactive.list_reply.id),
            'List selection',
            15000
          );
        }

        if (message.interactive.button_reply) {
          return await withTimeout(
            handleListSelection(message.interactive.button_reply.id),
            'Button selection',
            15000
          );
        }
      } catch (error) {
        console.error('Error handling interactive message:', error);
        return {
          type: 'text',
          message: "I couldn't process that selection due to a technical issue. Please try again or type 'help' for available commands."
        };
      }

      return {
        type: 'text',
        message: "I couldn't process that selection. Please try again using text commands."
      };
    }

    // Handle text messages
    if (message.text?.body) {
      const messageText = message.text.body.toLowerCase().trim();
      console.log('Processing text message:', messageText);

      // Handle specific commands
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
            message: "Hello! I'm your Warm Karoo event assistant. How can I help you today? Try typing 'events', 'tasks', or 'help'."
          };
        }
      }

      if (messageText === 'help' || messageText === 'commands') {
        return getHelpMessage();
      }

      if (messageText === 'test') {
        return {
          type: 'text',
          message: "I'm working correctly! You can ask me about events, tasks, or type 'help' for more commands."
        };
      }

      // Handle next event query
      if (messageText.includes('next event') || messageText === 'next' || messageText === 'next event') {
        console.log('Direct handling of next event query');
        try {
          // Try with timeout
          return await withTimeout(
            getNextEvent(), 
            'Next event query',
            15000
          );
        } catch (timeoutError) {
          console.error('Timeout error getting next event:', timeoutError);
          
          // Fallback direct query if timeout occurs
          try {
            console.log('Fallback: Direct query for next event');
            const today = new Date();
            const { data: events, error } = await supabase
              .from('events')
              .select('name, event_date, event_type, pax')
              .gte('event_date', today.toISOString())
              .is('deleted_at', null)
              .order('event_date', { ascending: true })
              .limit(1);
              
            if (error) throw error;
            
            if (!events || events.length === 0) {
              return {
                type: 'text',
                message: "No upcoming events found at this time."
              };
            }
            
            const event = events[0];
            const eventDate = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
            
            return {
              type: 'text',
              message: `Next event: ${event.name}\nDate: ${eventDate}\nType: ${event.event_type}\nGuests: ${event.pax || 'Not specified'}`
            };
          } catch (fallbackError) {
            console.error('Error in fallback event query:', fallbackError);
            return {
              type: 'text',
              message: "I couldn't retrieve your next event information. Please try again later or try a different command like 'help'."
            };
          }
        }
      }

      if (messageText.includes('events') || messageText.includes('upcoming events') || messageText === 'events' || messageText === 'upcoming') {
        console.log('Direct handling of events query');
        try {
          // First try to return the formatted event list
          return await withTimeout(
            getUpcomingEventsList(),
            'Upcoming events query',
            15000
          );
        } catch (error) {
          console.error('Error getting upcoming events list:', error);
          
          // Fallback to a simple fetch as a secondary attempt
          try {
            const events = await fetchEvents();
            console.log(`Found ${events.length} events in database`);
            
            if (events.length === 0) {
              return {
                type: 'text',
                message: "I don't see any events in the system yet. Would you like to create one?"
              };
            }
            
            // Format a simple text response for events
            const eventsList = events.slice(0, 5).map(event => {
              const date = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
              return `• ${event.name} - ${date} (${event.event_type})`;
            }).join('\n');
            
            return {
              type: 'text',
              message: `Upcoming events:\n\n${eventsList}\n\nShowing ${Math.min(events.length, 5)} of ${events.length} total events.`
            };
          } catch (secondError) {
            console.error('Database fallback failed:', secondError);
            return {
              type: 'text',
              message: "I'm having trouble accessing the event database right now. Please try again in a moment or try a different command like 'help'."
            };
          }
        }
      }

      if (messageText.includes('next task') || messageText === 'next task') {
        try {
          return await withTimeout(
            getNextTask(message.from),
            'Next task query',
            10000
          );
        } catch (error) {
          console.error('Error getting next task:', error);
          return {
            type: 'text',
            message: "I couldn't retrieve your next task. Please try again shortly or try the 'tasks' command to see all tasks."
          };
        }
      }

      if (messageText.includes('tasks') || messageText.includes('todo') || messageText === 'tasks' || messageText === 'todo') {
        try {
          return await withTimeout(
            getTodoList(),
            'Tasks query',
            12000
          );
        } catch (error) {
          console.error('Error getting todo list:', error);
          return {
            type: 'text',
            message: "I ran into an issue retrieving your tasks. Please try again shortly or try a different command like 'help'."
          };
        }
      }

      if (messageText.includes('when') && (messageText.includes('event') || messageText.includes('next'))) {
        console.log('Query about when the next event is');
        try {
          return await withTimeout(
            getNextEvent(),
            'Next event query from when question',
            15000
          );
        } catch (error) {
          console.error('Error processing when query:', error);
          return {
            type: 'text',
            message: "I'm having trouble finding information about your next event. Please try typing 'next event' instead."
          };
        }
      }

      // For all other messages, use AI to generate a response
      try {
        return await withTimeout(
          handleAIQuestion(message.text.body),
          'AI question handling',
          30000 // 30 second timeout - AI processing takes longer
        );
      } catch (error) {
        if (error.message?.includes('timeout')) {
          console.error('AI question handling timed out:', error);
          return {
            type: 'text',
            message: "It's taking me longer than expected to process your question. Could you please try asking in a simpler way or using one of our basic commands like 'events' or 'help'?"
          };
        }
        
        console.error('Error handling AI question:', error);
        return {
          type: 'text',
          message: "I'm having difficulty processing your question. Please try asking in a different way or try one of our basic commands like 'events' or 'tasks'."
        };
      }
    }

    console.error('Invalid message format:', JSON.stringify(message, null, 2));
    return {
      type: 'text',
      message: "I couldn't understand that message. Please try again or type 'help' for available commands."
    };
  } catch (error) {
    console.error('Error in handleMessage:', {
      message: error.message,
      stack: error.stack
    });
    return handleError(error, 'handleMessage');
  }
};
