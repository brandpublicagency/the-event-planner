import { WhatsAppResponse } from './timeoutUtils.ts';

/**
 * Centralized error handler for consistent error messages
 * 
 * @param error The error object
 * @param context Context where the error occurred
 * @returns A properly formatted WhatsApp response
 */
export const handleError = (error: any, context: string): WhatsAppResponse => {
  // Log detailed error information
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    details: error.details || 'No details',
    code: error.code || 'No error code'
  });
  
  // Categorize the error
  if (isConnectionError(error)) {
    return {
      type: 'text',
      message: "I'm having trouble connecting to our system right now. Please try again in a few moments."
    };
  }
  
  if (isTimeoutError(error)) {
    return {
      type: 'text',
      message: "The operation is taking longer than expected. Please try a simpler request or try again later."
    };
  }
  
  if (isDataFormatError(error)) {
    return {
      type: 'text',
      message: "I encountered an issue with the data format. Please try a different request or contact support."
    };
  }
  
  // Generic error response
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again or type 'help' for available commands."
  };
};

/**
 * Checks if an error is related to database or network connections
 */
export const isConnectionError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.message?.includes('connection') || 
    error.message?.includes('network') ||
    error.message?.includes('socket') ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'PGCONNECTION' ||
    error.message?.includes('fetch failed')
  );
};

/**
 * Checks if an error is related to a timeout
 */
export const isTimeoutError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.message?.includes('timed out') ||
    error.message?.includes('timeout') ||
    error.name === 'AbortError' ||
    error.code === 'ETIMEDOUT'
  );
};

/**
 * Checks if an error is related to data formatting issues
 */
export const isDataFormatError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.message?.includes('format') ||
    error.message?.includes('parse') ||
    error.message?.includes('JSON') ||
    error.message?.includes('syntax')
  );
};

/**
 * Returns a user-friendly error message based on the error type
 */
export const getFriendlyErrorMessage = (error: any): string => {
  if (isConnectionError(error)) {
    return "I'm having trouble connecting to our system right now. Please try again in a few moments.";
  }
  
  if (isTimeoutError(error)) {
    return "The operation took too long to complete. Please try a simpler request or try again later.";
  }
  
  if (isDataFormatError(error)) {
    return "I had trouble processing the data format. Please try again with a different request.";
  }
  
  if (error.code === 'PGCONNECTION') {
    return "Our database is currently experiencing connection issues. Please try again later.";
  }
  
  // Default message
  return "Something went wrong while processing your request. Please try again or contact support if the issue persists.";
};