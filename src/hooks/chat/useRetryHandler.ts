
import { useState, useCallback } from "react";

interface UseRetryHandlerProps {
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetIsLoading: (loading: boolean) => void;
}

export const useRetryHandler = ({
  onAddSystemMessage,
  onSetIsLoading
}: UseRetryHandlerProps) => {
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [useStreamingMode, setUseStreamingMode] = useState(true);
  
  const handleError = useCallback((error: any, tempMessageId: string | null) => {
    console.error('Error in chat request:', error);
    
    // Increment retry counter
    const newAttempts = retryAttempts + 1;
    setRetryAttempts(newAttempts);
    
    // Determine error message based on retry attempts
    let errorMessage = "I'm having trouble connecting to the assistant services. Please try again later.";
    
    if (newAttempts > 1) {
      errorMessage = "I'm still having connection issues. Please check your internet connection or try again in a few minutes.";
    }
    
    onAddSystemMessage(errorMessage, tempMessageId);
    onSetIsLoading(false);
  }, [retryAttempts, onAddSystemMessage, onSetIsLoading]);
  
  const resetRetries = useCallback(() => {
    setRetryAttempts(0);
  }, []);
  
  return {
    retryAttempts,
    setRetryAttempts,
    useStreamingMode,
    setUseStreamingMode,
    handleError,
    resetRetries
  };
};
