import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './eventHandler.ts';
import { getNextTask } from './taskHandler.ts';
import { handleAIQuestion } from './questionHandler.ts';
import { formatEventMenu } from '../formatters/eventFormatter.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handleMessage = async (message: any) => {
  try {
    console.log('Processing incoming message:', JSON.stringify(message, null, 2));

    // Handle interactive messages (list or button selections)
    if (message.interactive) {
      console.log('Processing interactive message:', {
        type: message.interactive.type,
        data: JSON.stringify(message.interactive, null, 2)
      });
      
      if (message.interactive.list_reply) {
        return await handleListSelection(message.interactive.list_reply.id);
      }

      if (message.interactive.button_reply) {
        return await handleListSelection(message.interactive.button_reply.id);
      }

      return {
        type: 'text',
        message: "I couldn't process that selection. Please try again."
      };
    }

    // Handle text messages
    if (message.text?.body) {
      const messageText = message.text.body.toLowerCase().trim();
      console.log('Processing text message:', messageText);

      // Handle specific commands
      if (['hi', 'hello', 'hey'].includes(messageText)) {
        return {
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: 'Welcome! How can I help?'
            },
            body: {
              text: 'Please select an option:'
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
                  }
                ]
              }]
            }
          }
        };
      }

      if (messageText === 'help') {
        return {
          type: 'text',
          message: `Available commands:
• Send 'hi' or 'hello' for main menu
• 'next event' for upcoming event
• 'next task' for next task
• Select from the list menu for more options
• Ask any question about events or tasks
• 'help' to see this message`
        };
      }

      // Handle specific queries
      if (messageText === 'next event') {
        return await getNextEvent();
      }

      if (messageText === 'next task') {
        return await getNextTask(message.from);
      }

      // For all other messages, use AI to generate a natural language response
      return await handleAIQuestion(message.text.body);
    }

    // Handle messages without text or interactive content
    console.error('Invalid message format:', JSON.stringify(message, null, 2));
    return {
      type: 'text',
      message: "I couldn't understand that message. Please try again or type 'help' for available commands."
    };
  } catch (error) {
    console.error('Error in handleMessage:', error);
    return {
      type: 'text',
      message: "I encountered an error. Please try again or type 'help' for available commands."
    };
  }
};