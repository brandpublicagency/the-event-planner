
import { useCallback } from "react";
import { useChatState } from "@/hooks/useChatState";
import { useActionHandler } from "./handlers/ActionHandler";
import { useAIMessageHandler } from "./handlers/AIMessageHandler";
import { useWhatsAppMessageHandler } from "./handlers/WhatsAppMessageHandler";

interface ChatMessageHandlerProps {
  children: React.ReactNode;
}

const ChatMessageHandler = ({ children }: ChatMessageHandlerProps) => {
  const {
    inputValue,
    messages,
    isLoading,
    pendingAction,
    addUserMessage,
    addSystemMessage,
    setIsLoading,
    setPendingAction,
    clearInput
  } = useChatState();

  // Set up AI message handler
  const { fetchAIResponse } = useAIMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput
  });

  // Set up WhatsApp message handler
  const { fetchWhatsAppResponse } = useWhatsAppMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput
  });

  // Set up action handler
  const { handlePendingAction } = useActionHandler();

  // Handle user's message submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there's a pending confirmation action
    if (pendingAction) {
      if (inputValue.toLowerCase().includes('yes') || 
          inputValue.toLowerCase().includes('confirm') ||
          inputValue.toLowerCase().includes('ok') ||
          inputValue.toLowerCase().includes('sure')) {
        addUserMessage(inputValue);
        clearInput();
        await handlePendingAction(pendingAction, true);
      } else if (
        inputValue.toLowerCase().includes('no') ||
        inputValue.toLowerCase().includes('cancel') ||
        inputValue.toLowerCase().includes('don\'t')
      ) {
        addUserMessage(inputValue);
        clearInput();
        await handlePendingAction(pendingAction, false);
      } else {
        // For any other input during a pending action
        addUserMessage(inputValue);
        addSystemMessage("Please confirm with 'yes' or decline with 'no'.");
        clearInput();
      }
      return;
    }

    // Don't process empty messages
    if (!inputValue.trim()) return;
    
    // Add user message to the chat
    addUserMessage(inputValue);
    
    // Decide which message handler to use
    try {
      // Try to use OpenAI API first
      await fetchAIResponse(inputValue);
    } catch (error) {
      console.error('Error with AI response, falling back to WhatsApp handler:', error);
      
      // Fall back to using WhatsApp Webhook function
      try {
        await fetchWhatsAppResponse(inputValue);
      } catch (fallbackError) {
        console.error('WhatsApp fallback also failed:', fallbackError);
        addSystemMessage(
          "I'm having trouble connecting to the assistant services. Please try again later."
        );
        setIsLoading(false);
        clearInput();
      }
    }
  }, [
    inputValue, 
    pendingAction, 
    addUserMessage, 
    addSystemMessage, 
    clearInput, 
    fetchAIResponse, 
    fetchWhatsAppResponse, 
    handlePendingAction, 
    setIsLoading
  ]);

  return children({
    inputValue,
    messages,
    isLoading,
    pendingAction,
    handleSubmit
  });
};

export default ChatMessageHandler;
