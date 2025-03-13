
import { WhatsAppResponse } from './timeoutUtils.ts';

/**
 * Utility function for standardized error handling
 */
export const handleError = (error: any, context: string): WhatsAppResponse => {
  // Log the error with the context
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    context
  });
  
  // Check for specific error types to give more helpful responses
  if (error.message?.includes('timeout')) {
    return {
      type: 'text',
      message: "It's taking longer than expected to process your request. Please try again in a moment or try a simpler command."
    };
  }
  
  if (error.message?.includes('permission') || error.code === '42501' || error.code === 'PGRST301') {
    return {
      type: 'text',
      message: "I don't have permission to access that information. This might be a system configuration issue. Please try again later."
    };
  }
  
  if (error.code === '42P01') {
    return {
      type: 'text',
      message: "There seems to be an issue with our database setup. Please contact support if this persists."
    };
  }
  
  // Generic friendly error message for users
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again or type 'help' for available commands."
  };
};
