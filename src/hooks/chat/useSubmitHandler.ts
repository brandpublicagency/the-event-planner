
import { useCallback } from "react";
import { ChatMessage, PendingAction } from "@/types/chat";

interface UseSubmitHandlerProps {
  inputValue: string;
  messages: ChatMessage[];
  pendingAction: PendingAction | null;
  isLoading: boolean;
  isStreaming: boolean;
  useStreamingMode: boolean;
  addUserMessage: (text: string) => void;
  clearInput: () => void;
  setIsLoading: (isLoading: boolean) => void;
  handlePendingAction: (pendingAction: PendingAction, isConfirmed: boolean) => Promise<void>;
  fetchAIResponse: (inputText: string, messages?: ChatMessage[]) => Promise<void>;
  fetchWhatsAppResponse: (inputText: string) => Promise<void>;
  processConfirmation: (inputValue: string, pendingAction: PendingAction) => Promise<void>;
  setUseStreamingMode: (useStreamingMode: boolean) => void;
  setRetryAttempts: (retryAttempts: number | ((prevAttempts: number) => number)) => void;
  setTempMessageId: (id: string | null) => void;
  addSystemMessage: (message: string, messageId?: string) => void;
  retryAttempts: number;
  tempMessageId: string | null;
}

export const useSubmitHandler = ({
  inputValue,
  messages,
  pendingAction,
  isLoading,
  isStreaming,
  useStreamingMode,
  addUserMessage,
  clearInput,
  setIsLoading,
  handlePendingAction,
  fetchAIResponse,
  fetchWhatsAppResponse,
  processConfirmation,
  setUseStreamingMode,
  setRetryAttempts,
  setTempMessageId,
  addSystemMessage,
  retryAttempts,
  tempMessageId
}: UseSubmitHandlerProps) => {
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission when loading
    if (isLoading || isStreaming) {
      console.log('Already processing a message, please wait...');
      return;
    }
    
    // Check if there's a pending confirmation action
    if (pendingAction) {
      await processConfirmation(inputValue, pendingAction);
      return;
    }

    // Don't process empty messages
    if (!inputValue.trim()) return;
    
    // Add user message to the chat
    const userMessage = { text: inputValue, isUser: true, id: Date.now().toString() };
    addUserMessage(inputValue);
    
    // Start loading state
    setIsLoading(true);
    
    // Clear input after sending
    clearInput();

    try {
      console.log('Using streaming mode:', useStreamingMode);
      
      if (useStreamingMode) {
        // Use streaming mode with full conversation history
        await fetchAIResponse(inputValue, [...messages, userMessage]);
        setRetryAttempts(0);
      } else {
        // Use regular (non-streaming) mode
        console.log('Attempting to use regular AI response handler');
        await fetchAIResponse(inputValue);
        setRetryAttempts(0);
      }
    } catch (error) {
      console.error('Error with AI response:', error);
      
      // If streaming fails, try regular mode
      if (useStreamingMode) {
        console.log('Streaming failed, falling back to regular mode');
        setUseStreamingMode(false);
        
        try {
          await fetchAIResponse(inputValue);
          setRetryAttempts(0);
          return;
        } catch (regularError) {
          console.error('Regular mode also failed:', regularError);
        }
      }
      
      // Fall back to using WhatsApp Webhook function
      try {
        console.log('Falling back to WhatsApp handler');
        
        // Update the temporary message
        const tempId = String(Date.now());
        setTempMessageId(tempId);
        addSystemMessage("Processing...", tempId);
        
        await fetchWhatsAppResponse(inputValue);
        setRetryAttempts(0);
      } catch (fallbackError) {
        console.error('WhatsApp fallback also failed:', fallbackError);
        
        // Increment retry counter
        const newAttempts = retryAttempts + 1;
        setRetryAttempts(newAttempts);
        
        // Determine error message based on retry attempts
        let errorMessage = "I'm having trouble connecting to the assistant services. Please try again later.";
        
        if (newAttempts > 1) {
          errorMessage = "I'm still having connection issues. Please check your internet connection or try again in a few minutes.";
        }
        
        addSystemMessage(errorMessage, tempMessageId);
        setIsLoading(false);
      }
    }
  }, [
    inputValue, 
    pendingAction, 
    isLoading,
    isStreaming,
    useStreamingMode,
    messages,
    addUserMessage, 
    addSystemMessage, 
    clearInput, 
    fetchAIResponse, 
    fetchWhatsAppResponse, 
    handlePendingAction, 
    setIsLoading,
    retryAttempts,
    setTempMessageId,
    setRetryAttempts,
    processConfirmation,
    tempMessageId,
    setUseStreamingMode
  ]);

  return { handleSubmit };
};
