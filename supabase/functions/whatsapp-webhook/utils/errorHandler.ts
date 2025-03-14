
import { WhatsAppResponse } from './timeoutUtils.ts';

/**
 * Standardized error handling function for webhook responses
 */
export const handleError = (error: any, context: string): WhatsAppResponse => {
  // Log the full error details
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    details: error.details || 'No additional details'
  });
  
  // Determine if it's a database error
  const isDbError = error.message?.includes('database') || 
                    error.message?.includes('query') ||
                    error.code?.startsWith('22') || // PostgreSQL error codes
                    error.code?.startsWith('23');
  
  // Create appropriate user-facing message
  let userMessage = "I encountered an unexpected error. Please try again shortly.";
  
  if (isDbError) {
    userMessage = "I'm having trouble accessing the database right now. Please try again in a moment.";
  } else if (error.message?.includes('timeout')) {
    userMessage = "The operation took too long to complete. Please try again or use a simpler command.";
  } else if (error.message?.includes('validation')) {
    userMessage = "There was an issue with processing your request. Please try again with a different format.";
  }
  
  return {
    type: 'text',
    message: userMessage
  };
};
