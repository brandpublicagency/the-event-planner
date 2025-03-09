
const DEFAULT_TIMEOUT = 15000; // 15 seconds default timeout

export const withTimeout = async (
  promise: Promise<any>,
  operationName: string,
  timeout = DEFAULT_TIMEOUT
) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation ${operationName} timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error(`Timeout error in ${operationName}:`, error);
    throw error;
  }
};

export const handleTimeoutError = (error: any) => {
  const isTimeout = error.message && error.message.includes('timed out');
  
  if (isTimeout) {
    console.error('Operation timed out:', error.message);
    return {
      type: 'text',
      message: "I'm sorry, but it's taking longer than expected to process your request. Please try again or try a simpler question."
    };
  }
  
  return {
    type: 'text',
    message: "I encountered an error while processing your request. Please try again later."
  };
};
