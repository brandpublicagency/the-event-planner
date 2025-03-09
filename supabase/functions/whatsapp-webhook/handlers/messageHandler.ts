
import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './event/index.ts';
import { getNextTask, getTodoList } from './task/index.ts';
import { handleAIQuestion } from './question/index.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout, handleTimeoutError, WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { fetchEvents, checkDatabaseConnection } from '../utils/dataFetcher/index.ts';
import { handleError } from '../utils/errorHandler.ts';

export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message:', JSON.stringify(message, null, 2));

    // First, check database connection
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      console.error('Database connection check failed');
      return {
        type: 'text',
        message: "I'm having trouble connecting to our database right now. Please try again in a few moments."
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
        message: "I couldn't process that selection. Please try again."
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
            message: "Hello! I'm your event assistant. How can I help you today?"
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

      // Handle specific queries with timeout
      if (messageText.includes('next event') || messageText === 'next event') {
        try {
          return await withTimeout(
            getNextEvent(), 
            'Next event query',
            10000
          );
        } catch (error) {
          console.error('Error getting next event:', error);
          return {
            type: 'text',
            message: "I'm having trouble retrieving your next event. Please try again shortly."
          };
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
            message: "I couldn't retrieve your next task. Please try again shortly."
          };
        }
      }

      if (messageText.includes('tasks') || messageText.includes('todo') || messageText === 'tasks') {
        try {
          return await withTimeout(
            getTodoList(),
            'Tasks query',
            10000
          );
        } catch (error) {
          console.error('Error getting todo list:', error);
          return {
            type: 'text',
            message: "I ran into an issue retrieving your tasks. Please try again shortly."
          };
        }
      }

      if (messageText.includes('events') || messageText.includes('upcoming events')) {
        try {
          // Fetch some events to check if DB access is working
          const events = await fetchEvents();
          console.log(`Found ${events.length} events in database`);
          
          if (events.length === 0) {
            return {
              type: 'text',
              message: "I don't see any events in the system yet. Would you like to create one?"
            };
          }
        } catch (error) {
          console.error('Database connection test failed:', error);
          return {
            type: 'text',
            message: "I'm having trouble accessing the event database right now. Please try again in a moment."
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
