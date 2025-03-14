
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
                    error.message?.includes('relation') ||
                    error.message?.includes('table') ||
                    error.code?.startsWith('22') || // PostgreSQL error codes
                    error.code?.startsWith('23') ||
                    error.code?.startsWith('42');
  
  // Determine if it's a timeout error
  const isTimeoutError = error.message?.includes('timeout') ||
                         error.message?.includes('timed out') ||
                         error.name === 'AbortError' ||
                         error.name === 'TimeoutError';
  
  // Determine if it's a connectivity error
  const isConnectivityError = error.message?.includes('network') ||
                              error.message?.includes('connection') ||
                              error.message?.includes('connect') ||
                              error.message === ""; // Empty error message often indicates connection issues
                              
  // Create appropriate user-facing message
  let userMessage = "I encountered an unexpected error. Please try again shortly.";
  
  if (isDbError) {
    userMessage = "I'm having trouble accessing the database right now. Please try again in a moment.";
  } else if (isTimeoutError) {
    userMessage = "The operation took too long to complete. Please try again or use a simpler command.";
  } else if (isConnectivityError) {
    userMessage = "I'm experiencing connection issues right now. Please try again in a few moments.";
  } else if (error.message?.includes('validation')) {
    userMessage = "There was an issue with processing your request. Please try again with a different format.";
  }
  
  return {
    type: 'text',
    message: userMessage
  };
};

/**
 * Specialized handler for recovery from database errors
 */
export const attemptDatabaseRecovery = async (
  originalError: any,
  recoveryFunction: () => Promise<any>,
  fallbackResponse: WhatsAppResponse
): Promise<WhatsAppResponse> => {
  try {
    console.log('Attempting database recovery operation');
    const result = await recoveryFunction();
    console.log('Recovery operation successful');
    return result;
  } catch (recoveryError) {
    console.error('Recovery operation failed:', recoveryError);
    return fallbackResponse;
  }
};
