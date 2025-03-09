
export const handleError = (error: any, context: string) => {
  // Log detailed error information
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    details: error.details || 'No details',
    code: error.code || 'No error code'
  });
  
  // Determine if this is a database connection error
  const isConnectionError = error.message?.includes('connection') || 
                          error.message?.includes('timeout') ||
                          error.code === 'ECONNREFUSED';
  
  // Return appropriate message based on error type
  if (isConnectionError) {
    return {
      type: 'text',
      message: "I'm having trouble connecting to our system right now. Please try again in a few moments."
    };
  }
  
  // Generic error response
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again or type 'help' for available commands."
  };
};

// Function to detect specific error types
export const isDataFetchingError = (error: any): boolean => {
  return error.message?.includes('fetch') || 
         error.message?.includes('database') ||
         error.message?.includes('supabase');
};

// Function to provide more user-friendly error messages
export const getFriendlyErrorMessage = (error: any): string => {
  if (isDataFetchingError(error)) {
    return "I'm having trouble accessing your information right now. Please try again shortly.";
  }
  
  if (error.code === 'PGCONNECTION') {
    return "Our system is currently experiencing connection issues. Please try again later.";
  }
  
  return "Something went wrong while processing your request. Please try again or contact support if the issue persists.";
};
