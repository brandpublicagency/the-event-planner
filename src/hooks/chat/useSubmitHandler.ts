
import { FormEvent } from "react";
import { PendingAction, ChatMessage } from "@/types/chat";

interface UseSubmitHandlerProps {
  inputValue: string;
  messages: ChatMessage[];
  pendingAction: PendingAction | null;
  isLoading: boolean;
  isStreaming: boolean;
  useStreamingMode: boolean;
  addUserMessage: (message: string) => void;
  clearInput: () => void;
  setIsLoading: (loading: boolean) => void;
  handlePendingAction: (action: PendingAction, confirmation: boolean) => Promise<void>;
  fetchAIResponse: (inputText: string, messages?: ChatMessage[]) => Promise<void>;
  fetchWhatsAppResponse?: (inputText: string) => Promise<void>;
  processConfirmation: (input: string) => boolean;
  setUseStreamingMode: (useStreaming: boolean) => void;
  setRetryAttempts: (attempts: number) => void;
  setTempMessageId: (id: string | null) => void;
  addSystemMessage: (message: string, messageId?: string) => void;
  retryAttempts: number;
  tempMessageId: string | null;
  forceLocalData?: boolean;
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
  tempMessageId,
  forceLocalData = false
}: UseSubmitHandlerProps) => {
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading || isStreaming) {
      return;
    }
    
    // Handle confirmations first
    if (pendingAction) {
      const wasProcessed = processConfirmation(inputValue);
      if (wasProcessed) return;
    }

    // Show loading indicator
    setIsLoading(true);

    try {
      // Use the streaming mode by default
      if (useStreamingMode && !forceLocalData) {
        try {
          // Clear any existing temp message ID
          if (tempMessageId) {
            setTempMessageId(null);
          }
          
          await fetchAIResponse(inputValue, messages);
          clearInput();
          return;
        } catch (error) {
          console.error('Error in streaming mode, switching to local data:', error);
          // If streaming fails, switch to local data mode
          if (!forceLocalData) {
            // Only set this if not already in force local data mode
            setUseStreamingMode(false);
            setRetryAttempts(retryAttempts + 1);
          }
        }
      }

      // If stream failed or isn't being used, try the local data approach
      try {
        await fetchAIResponse(inputValue);
      } catch (error) {
        console.error('Error in local AI mode:', error);
        
        // If we have a WhatsApp handler and local data failed, try that
        if (fetchWhatsAppResponse) {
          try {
            await fetchWhatsAppResponse(inputValue);
          } catch (whatsappError) {
            console.error('WhatsApp fallback also failed:', whatsappError);
            
            // If both approaches failed, show an error message
            if (tempMessageId) {
              addSystemMessage(
                "I'm having trouble connecting to any of our services. Please try again later or check your network connection.",
                tempMessageId
              );
            } else {
              addSystemMessage(
                "I'm having trouble connecting to any of our services. Please try again later or check your network connection."
              );
            }
          }
        } else {
          // If no WhatsApp handler, show the error
          if (tempMessageId) {
            addSystemMessage(
              "I couldn't process your request. Please try asking something different or more specific.",
              tempMessageId
            );
          } else {
            addSystemMessage(
              "I couldn't process your request. Please try asking something different or more specific."
            );
          }
        }
      }
    } catch (error) {
      console.error('Unhandled error in handleSubmit:', error);
      
      // Reset loading state
      setIsLoading(false);
      
      // Show error message
      if (tempMessageId) {
        addSystemMessage(
          "I encountered an unexpected error. Please try again with a different question.",
          tempMessageId
        );
      } else {
        addSystemMessage(
          "I encountered an unexpected error. Please try again with a different question."
        );
      }
    } finally {
      // Always clear the input
      clearInput();
    }
  };

  return {
    handleSubmit
  };
};
