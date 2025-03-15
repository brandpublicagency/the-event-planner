
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
  processConfirmation: (input: string) => boolean; // Fixed type signature
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
  forceLocalData = true // Changed default to true
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

    // Add user message to chat
    addUserMessage(inputValue);

    // Show loading indicator
    setIsLoading(true);

    try {
      // Try direct AI processing without streaming
      try {
        await fetchAIResponse(inputValue);
        clearInput();
        return;
      } catch (error) {
        console.error('Error in local AI mode:', error);
        
        // If local data approach failed and we have a WhatsApp handler, try that
        if (fetchWhatsAppResponse) {
          try {
            await fetchWhatsAppResponse(inputValue);
          } catch (whatsappError) {
            console.error('WhatsApp fallback also failed:', whatsappError);
            
            // If both approaches failed, show an error message
            if (tempMessageId) {
              addSystemMessage(
                "I'm having trouble connecting to any of our services. Please try again with a more specific question about your events.",
                tempMessageId
              );
            } else {
              addSystemMessage(
                "I'm having trouble connecting to any of our services. Please try again with a more specific question about your events."
              );
            }
          }
        } else {
          // If no WhatsApp handler, show the error
          if (tempMessageId) {
            addSystemMessage(
              "I couldn't process your request. Please try asking something more specific about your events, like 'What is my next event?' or 'Show me events in July'.",
              tempMessageId
            );
          } else {
            addSystemMessage(
              "I couldn't process your request. Please try asking something more specific about your events, like 'What is my next event?' or 'Show me events in July'."
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
          "I encountered an unexpected error. Please try asking about specific events by name or date.",
          tempMessageId
        );
      } else {
        addSystemMessage(
          "I encountered an unexpected error. Please try asking about specific events by name or date."
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
