import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './eventHandler.ts';
import { getNextTask } from './taskHandler.ts';

export const handleMessage = async (message: any) => {
  console.log('Processing message:', message);

  try {
    // Handle interactive responses (list selections)
    if (message.interactive) {
      console.log('Handling interactive message:', message.interactive);
      
      if (message.interactive.list_reply) {
        return await handleListSelection(message.interactive.list_reply.id);
      }
    }

    // Handle text messages
    const messageText = message.text?.body?.toLowerCase().trim();
    if (!messageText) {
      console.error('Invalid message format:', message);
      throw new Error('Invalid message format');
    }

    // Handle greetings
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
                { id: 'upcoming_events', title: 'Upcoming Events', description: 'View all upcoming events' },
                { id: 'event_menus', title: 'Event Menus', description: 'View event menus' },
                { id: 'todo_list', title: 'Your To-do List', description: 'View your pending tasks' }
              ]
            }]
          }
        }
      };
    }

    // Handle specific commands
    if (messageText.includes('next event')) {
      return await getNextEvent();
    }

    if (messageText.includes('next task')) {
      return await getNextTask(message.from);
    }

    if (messageText === 'help') {
      return {
        type: 'text',
        message: `Available commands:
• Send 'hi' or 'hello' for main menu
• 'next event' for upcoming event
• 'next task' for next task
• Select from the list menu for more options
• 'help' to see this message`
      };
    }

    // Default response
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
              { id: 'upcoming_events', title: 'Upcoming Events', description: 'View all upcoming events' },
              { id: 'event_menus', title: 'Event Menus', description: 'View event menus' },
              { id: 'todo_list', title: 'Your To-do List', description: 'View your pending tasks' }
            ]
          }]
        }
      }
    };

  } catch (error) {
    console.error('Error in handleMessage:', error);
    return {
      type: 'text',
      message: "I encountered an error. Please try again or type 'help' for available commands."
    };
  }
};