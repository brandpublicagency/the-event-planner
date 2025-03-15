
import { WhatsAppResponse } from '../utils/timeoutUtils.ts';
import { withTimeout, handleTimeoutError } from '../utils/timeoutUtils.ts';
import { checkDatabaseConnection } from '../utils/dataFetcher/index.ts';
import { 
  handleBasicCommands,
  handleDirectEventQueries,
  handleTasksQueries,
  handleMenuQueries
} from './basicHandlers.ts';

/**
 * Routes text messages to the appropriate handler
 * @param messageText The text content of the message
 * @returns Promise resolving to the appropriate WhatsApp response
 */
export const routeTextMessage = async (messageText: string): Promise<WhatsAppResponse> => {
  console.log('Routing text message:', messageText);
  
  const lowerCaseText = messageText.toLowerCase().trim();
  
  try {
    // Try all specialized handlers in sequence
    const handlers = [
      handleBasicCommands,
      handleDirectEventQueries,
      handleTasksQueries,
      handleMenuQueries
    ];
    
    for (const handler of handlers) {
      try {
        const result = await withTimeout(
          handler(lowerCaseText),
          `${handler.name} execution`,
          10000
        );
        
        // If handler returns a response, use it
        if (result) {
          return result;
        }
      } catch (handlerError) {
        console.error(`Error in handler ${handler.name}:`, handlerError);
        // Continue to next handler
      }
    }
    
    // If no handler matched, provide a fallback response
    return {
      type: 'text',
      message: "I'm not sure how to respond to that. Type 'help' to see available commands or try asking about events, tasks, or menus."
    };
  } catch (error) {
    console.error('Error routing text message:', error);
    return {
      type: 'text',
      message: "I encountered an unexpected error. Please try again or use a more specific command like 'events' or 'tasks'."
    };
  }
};
