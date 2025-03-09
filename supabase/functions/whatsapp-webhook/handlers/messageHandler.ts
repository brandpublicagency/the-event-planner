
import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './event/index.ts';
import { getNextTask } from './taskHandler.ts';
import { handleAIQuestion } from './questionHandler.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout } from '../utils/timeoutUtils.ts';
import { fetchEvents } from '../utils/dataFetcher.ts';

// Define a clear response type for better TypeScript support
export type WhatsAppResponse = 
  | { type: 'text'; message: string; }
  | { 
      type: 'interactive'; 
      interactive: {
        type: string;
        header?: { type: string; text: string; };
        body: { text: string; };
        action?: {
          button?: string;
          sections?: {
            title: string;
            rows: { id: string; title: string; description: string; }[];
          }[];
        };
      };
    };

export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message:', JSON.stringify(message, null, 2));

    // Handle interactive messages (list or button selections)
    if (message.interactive) {
      console.log('Processing interactive message:', {
        type: message.interactive.type,
        data: JSON.stringify(message.interactive, null, 2)
      });
      
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
      if (['hi', 'hello', 'hey', 'hallo'].includes(messageText)) {
        return await withTimeout(
          getWelcomeMessage(),
          'Welcome message',
          5000
        );
      }

      if (messageText === 'help') {
        return getHelpMessage();
      }

      // Handle specific queries with timeout
      if (messageText.includes('next event') || messageText === 'next event') {
        return await withTimeout(
          getNextEvent(), 
          'Next event query',
          10000
        );
      }

      if (messageText.includes('next task') || messageText === 'next task') {
        return await withTimeout(
          getNextTask(message.from),
          'Next task query',
          10000
        );
      }

      if (messageText.includes('events') || messageText.includes('upcoming events')) {
        try {
          // Fetch some events to check if DB access is working
          const events = await fetchEvents();
          console.log(`Found ${events.length} events in database`);
        } catch (error) {
          console.error('Database connection test failed:', error);
        }
      }

      // For all other messages, use AI to generate a response
      return await withTimeout(
        handleAIQuestion(message.text.body),
        'AI question handling',
        30000 // 30 second timeout - AI processing takes longer
      );
    }

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
