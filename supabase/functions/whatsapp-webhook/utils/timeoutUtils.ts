
export interface WhatsAppResponse {
  type: 'text' | 'interactive';
  message?: string;
  interactive?: any;
}

/**
 * Execute a promise with a timeout
 * @param promise The promise to execute
 * @param operationName Name of the operation (for logging)
 * @param timeoutMs Timeout in milliseconds
 * @returns Result of the promise
 * @throws Error if timeout or other error occurs
 */
export const withTimeout = async <T>(
  promise: Promise<T>,
  operationName: string,
  timeoutMs: number = 10000
): Promise<T> => {
  let timeoutId: number | undefined;
  
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
    
    // Race the original promise against the timeout
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
};

/**
 * Handle timeout errors with a standardized response
 */
export const handleTimeoutError = (error: any, operationName: string): WhatsAppResponse => {
  console.error(`Timeout error in ${operationName}:`, error);
  
  return {
    type: 'text',
    message: "I'm sorry, but that operation is taking too long. Please try again or use a simpler request."
  };
};
