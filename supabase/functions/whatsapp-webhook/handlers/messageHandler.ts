
import { handleListSelection } from './listHandler.ts';
import { getNextEvent } from './eventHandler.ts';
import { getNextTask } from './taskHandler.ts';
import { handleAIQuestion } from './questionHandler.ts';
import { getWelcomeMessage, getHelpMessage } from './welcomeHandler.ts';
import { withTimeout } from '../utils/timeoutUtils.ts';

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
        return await withTimeout(
          handleListSelection(message.interactive.list_reply.id),
          'List selection'
        );
      }

      if (message.interactive.button_reply) {
        return await withTimeout(
          handleListSelection(message.interactive.button_reply.id),
          'Button selection'
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
      if (['hi', 'hello', 'hey'].includes(messageText)) {
        return await withTimeout(
          getWelcomeMessage(),
          'Welcome message'
        );
      }

      if (messageText === 'help') {
        return getHelpMessage();
      }

      // Handle specific queries with timeout
      if (messageText === 'next event') {
        return await withTimeout(getNextEvent(), 'Next event query');
      }

      if (messageText === 'next task') {
        return await withTimeout(
          getNextTask(message.from),
          'Next task query'
        );
      }

      // For all other messages, use AI to generate a response
      return await withTimeout(
        handleAIQuestion(message.text.body),
        'AI question handling'
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
