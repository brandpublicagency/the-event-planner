
export interface WhatsAppResponse {
  type: 'text' | 'interactive';
  message?: string;
  interactive?: any;
}

export const withTimeout = async <T>(
  promise: Promise<T>,
  operationName: string,
  timeoutMs: number
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operationName} operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.error(`Timeout or error in ${operationName}:`, error);
    throw error;
  }
};

export const handleTimeoutError = (error: any, operationName: string): WhatsAppResponse => {
  console.error(`Error in ${operationName}:`, error);
  
  const isTimeout = error.message?.includes('timed out');
  
  if (isTimeout) {
    return {
      type: 'text',
      message: "I'm sorry, but the operation is taking longer than expected. Please try again shortly."
    };
  }
  
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again."
  };
};
