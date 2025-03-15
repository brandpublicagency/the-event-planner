
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { WhatsAppResponse } from './utils/timeoutUtils.ts';
import { withTimeout } from './utils/timeoutUtils.ts';
import { handleListSelection } from './handlers/listHandler.ts';
import { checkDatabaseConnection } from './utils/dataFetcher/index.ts';
import { routeTextMessage } from './handlers/messageRouter.ts';

/**
 * Main handler for all incoming WhatsApp messages
 */
export const handleMessage = async (message: any): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing incoming message type:', message.type);

    // First check database connection
    let dbConnected = false;
    try {
      dbConnected = await withTimeout(
        checkDatabaseConnection(),
        'Database connection check',
        5000
      );
    } catch (dbError) {
      console.error('Error or timeout checking database connection:', dbError);
      // Continue anyway - we'll handle specific operations carefully
    }

    if (!dbConnected) {
      console.warn('Database connection check failed - proceeding with caution');
    }

    // Handle interactive messages (list or button selections)
    if (message.interactive) {
      console.log('Processing interactive message:', message.interactive.type);
      
      try {
        // Handle list replies
        if (message.interactive.list_reply) {
          const id = message.interactive.list_reply.id;
          console.log('List selection ID:', id);
          return await withTimeout(
            handleListSelection(id),
            'List selection',
            20000
          );
        }

        // Handle button replies
        if (message.interactive.button_reply) {
          const id = message.interactive.button_reply.id;
          console.log('Button selection ID:', id);
          return await withTimeout(
            handleListSelection(id),
            'Button selection',
            20000
          );
        }
      } catch (error) {
        console.error('Error handling interactive message:', error);
        return {
          type: 'text',
          message: "I couldn't process that selection. Please try again or type 'help' for available commands."
        };
      }

      // Fallback for unrecognized interactive type
      return {
        type: 'text',
        message: "I couldn't understand that selection. Please try again."
      };
    }

    // Handle text messages
    if (message.text?.body) {
      return await routeTextMessage(message.text.body);
    }

    // Handle unknown message types
    console.warn('Unrecognized message format:', JSON.stringify(message, null, 2));
    return {
      type: 'text',
      message: "I couldn't understand that message. Please try again or type 'help' for available commands."
    };
  } catch (error) {
    console.error('Unhandled error in handleMessage:', {
      message: error.message,
      stack: error.stack
    });
    
    return {
      type: 'text',
      message: "I encountered an unexpected error. Please try again or use a more specific command like 'events' or 'tasks'."
    };
  }
};
