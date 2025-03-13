/**
 * Interface defining the structure of WhatsApp responses
 */
export interface WhatsAppResponse {
  type: 'text' | 'interactive';
  message?: string;
  interactive?: any;
}

/**
 * Wraps a promise with a timeout
 * 
 * @param promise The promise to wrap with a timeout
 * @param operationName Name of the operation (for logging)
 * @param timeoutMs Timeout in milliseconds
 * @returns The result of the promise if it completes before the timeout
 * @throws Error if the operation times out
 */
export const withTimeout = async <T>(
  promise: Promise<T>,
  operationName: string,
  timeoutMs: number = 15000 // Default 15 second timeout
): Promise<T> => {
  // Create a timeout promise that rejects after the specified time
  const timeoutPromise = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`${operationName} operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    // Use Promise.race to see which completes first
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    // Add context to the error
    if (error.message?.includes('timed out')) {
      console.error(`Operation timed out: ${operationName} (${timeoutMs}ms)`);
    } else {
      console.error(`Error in ${operationName}:`, error);
    }
    throw error;
  }
};

/**
 * Centralized function to handle timeout errors in a user-friendly way
 */
export const handleTimeoutError = (error: any): WhatsAppResponse => {
  console.error('Timeout or operation error:', error);
  
  const isTimeout = error.message?.includes('timed out');
  
  if (isTimeout) {
    return {
      type: 'text',
      message: "I'm sorry, but the operation is taking longer than expected. Please try again with a more specific request."
    };
  }
  
  // Database connection errors
  if (error.message?.includes('connection') || 
      error.code === 'PGCONNECTION' ||
      error.message?.includes('database')) {
    return {
      type: 'text',
      message: "I'm having trouble connecting to our database at the moment. Please try again shortly."
    };
  }
  
  // Generic error response
  return {
    type: 'text',
    message: "I encountered an unexpected error. Please try again or use a more specific command like 'help', 'events', or 'tasks'."
  };
};