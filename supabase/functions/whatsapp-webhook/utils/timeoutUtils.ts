// Utility for handling timeouts consistently across handlers
export const TIMEOUT_DURATION = 10000; // 10 seconds

export const withTimeout = async <T>(promise: Promise<T>, context: string): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error(`${context} timed out`)), TIMEOUT_DURATION);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.error(`Timeout in ${context}:`, error);
    throw error;
  }
};

export const handleTimeoutError = (error: Error) => {
  if (error.message.includes('timed out')) {
    return {
      type: 'text',
      message: "I apologize, but the request took too long to process. Please try a simpler request or try again in a moment."
    };
  }
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again."
  };
};