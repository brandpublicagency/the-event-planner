import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './eventHandler.ts';
import { getNextTask } from './taskHandler.ts';
import { handleEventQuestion } from '../questionHandler.ts';

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
        const selectedId = message.interactive.list_reply.id;
        console.log('List selection received:', selectedId);
        return await handleListSelection(selectedId);
      }

      if (message.interactive.button_reply) {
        const buttonId = message.interactive.button_reply.id;
        console.log('Button selection received:', buttonId);
        return await handleListSelection(buttonId);
      }

      console.log('Unknown interactive type:', message.interactive.type);
      return {
        type: 'text',
        message: "I couldn't process that selection. Please try again."
      };
    }

    // Handle text messages
    if (message.text?.body) {
      const messageText = message.text.body.toLowerCase().trim();
      console.log('Processing text message:', messageText);

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
                    id: 'event_menus', 
                    title: 'Event Menus',
                    description: 'View event menus'
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

      if (messageText.includes('next event')) {
        return await getNextEvent();
      }

      if (messageText.includes('next task')) {
        return await getNextTask(message.from);
      }

      if (messageText.includes('event') || 
          messageText.includes('when') || 
          messageText.includes('menu') ||
          messageText.includes('task')) {
        return await handleEventQuestion(messageText);
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

      // Default response for unrecognized text
      console.log('Unrecognized message, showing default menu');
      return {
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'How can I help?'
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
                  id: 'event_menus', 
                  title: 'Event Menus',
                  description: 'View event menus'
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