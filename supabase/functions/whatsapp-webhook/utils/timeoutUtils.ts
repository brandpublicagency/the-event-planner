
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
  let completed = false;
  
  try {
    console.log(`Starting operation '${operationName}' with ${timeoutMs}ms timeout`);
    
    const startTime = Date.now();
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        console.warn(`Operation '${operationName}' timed out after ${elapsed}ms (limit: ${timeoutMs}ms)`);
        reject(new Error(`Operation '${operationName}' timed out after ${elapsed}ms`));
      }, timeoutMs);
    });
    
    // Race the original promise against the timeout
    const result = await Promise.race([promise, timeoutPromise]);
    completed = true;
    
    const elapsed = Date.now() - startTime;
    console.log(`Operation '${operationName}' completed successfully in ${elapsed}ms`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error in operation '${operationName}': ${errorMessage}`);
    
    if (!completed && error instanceof Error) {
      error.name = 'TimeoutError';
    }
    
    throw error;
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

/**
 * Retry a promise-based operation with exponential backoff
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
  initialDelayMs: number = 200
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for operation '${operationName}'`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxRetries} for '${operationName}' failed:`, error);
      
      if (attempt < maxRetries) {
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  console.error(`All ${maxRetries} attempts for '${operationName}' failed`);
  throw lastError;
};
