
import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './event/index.ts';
import { getNextTask, getTodoList } from './task/index.ts';
import { handleAIQuestion } from './question/index.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout, handleTimeoutError, WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { fetchEvents, checkDatabaseConnection } from '../utils/dataFetcher.ts';
import { handleError } from '../utils/errorHandler.ts';

export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message:', JSON.stringify(message, null, 2));

    // First, check database connection
    await checkDatabaseConnection();

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
      if (['hi', 'hello', 'hey', 'hallo', 'howdy', 'greetings'].includes(messageText)) {
        return await withTimeout(
          getWelcomeMessage(),
          'Welcome message',
          5000
        );
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

      if (messageText.includes('tasks') || messageText.includes('todo') || messageText === 'tasks') {
        return await withTimeout(
          getTodoList(),
          'Tasks query',
          10000
        );
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
    console.error('Error in handleMessage:', {
      message: error.message,
      stack: error.stack
    });
    return handleError(error, 'handleMessage');
  }
};
