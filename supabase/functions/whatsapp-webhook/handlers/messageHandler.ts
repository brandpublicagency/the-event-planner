import { getNextEvent } from './eventHandler.ts';
import { getNextTask } from './taskHandler.ts';
import { handleAIQuestion } from './questionHandler.ts';

export const handleMessage = async (message: any) => {
  console.log('Processing message:', message);

  try {
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
                { id: 'next_event', title: 'Next Event' },
                { id: 'next_task', title: 'Next Task' },
                { id: 'help', title: 'Help' }
              ]
            }]
          }
        }
      };
    }

    // Handle specific commands
    if (messageText.includes('next event') || messageText === 'next_event') {
      return await getNextEvent();
    }

    if (messageText.includes('next task') || messageText === 'next_task') {
      return await getNextTask(message.from);
    }

    if (messageText === 'help') {
      return {
        type: 'text',
        message: `Available commands:
• Send 'hi' or 'hello' for main menu
• 'next event' for upcoming event
• 'next task' for next task
• Ask any question about events or tasks
• 'help' to see this message`
      };
    }

    // Handle natural language questions
    return await handleAIQuestion(messageText);

  } catch (error) {
    console.error('Error in handleMessage:', error);
    return {
      type: 'text',
      message: "I encountered an error. Please try again or type 'help' for available commands."
    };
  }
};