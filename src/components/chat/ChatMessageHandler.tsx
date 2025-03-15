
import { useCallback, useState } from "react";
import { useChatState } from "@/hooks/useChatState";
import { useActionHandler } from "./handlers/ActionHandler";
import { useAIMessageHandler } from "./handlers/AIMessageHandler";
import { useWhatsAppMessageHandler } from "./handlers/WhatsAppMessageHandler";
import { useMessageProcessor } from "./handlers/MessageProcessor";
import { ReactNode } from "react";
import { ChatMessage, PendingAction } from "@/types/chat";

interface ChatMessageHandlerProps {
  children: (props: {
    messages: ChatMessage[];
    isLoading: boolean;
    pendingAction: PendingAction | null;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => ReactNode;
  contextData?: any;
  inputValue?: string;
  isLoading?: boolean;
  setInputValue?: (value: string) => void;
  clearInput?: () => void;
}

const ChatMessageHandler = ({ 
  children, 
  contextData, 
  inputValue: externalInputValue,
  isLoading: externalIsLoading,
  setInputValue: externalSetInputValue,
  clearInput: externalClearInput
}: ChatMessageHandlerProps) => {
  const {
    inputValue: internalInputValue,
    messages,
    isLoading: internalIsLoading,
    pendingAction,
    addUserMessage,
    addSystemMessage,
    setIsLoading: internalSetIsLoading,
    setPendingAction,
    clearInput: internalClearInput
  } = useChatState();
  
  // Use external state if provided, otherwise use internal state
  const inputValue = externalInputValue !== undefined ? externalInputValue : internalInputValue;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = internalSetIsLoading;
  const clearInput = externalClearInput || internalClearInput;
  const setInputValue = externalSetInputValue || ((value: string) => {});

  // Track attempts for better error handling
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Set up message processor
  const { processAIResponse, tempMessageId, setTempMessageId } = useMessageProcessor({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput
  });

  // Set up AI message handler
  const { fetchAIResponse } = useAIMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput,
    contextData,
    onSetTempMessageId: setTempMessageId,
    processAIResponse
  });

  // Set up WhatsApp message handler for fallback
  const { fetchWhatsAppResponse } = useWhatsAppMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput,
    contextData
  });

  // Set up action handler
  const { handlePendingAction } = useActionHandler();

  // Handle user's message submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission when loading
    if (isLoading) {
      console.log('Already processing a message, please wait...');
      return;
    }
    
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
    
    // Show temporary loading message
    const tempId = Date.now().toString();
    setTempMessageId(tempId);
    addSystemMessage("Thinking...", tempId);
    
    // Start loading state
    setIsLoading(true);
    
    // Clear input after sending
    clearInput();
    
    // Decide which message handler to use
    try {
      // Try to use OpenAI API first
      console.log('Attempting to use AI response handler');
      await fetchAIResponse(inputValue);
      // Reset retry counter on success
      setRetryAttempts(0);
    } catch (error) {
      console.error('Error with AI response:', error);
      
      // Fall back to using WhatsApp Webhook function
      try {
        console.log('Falling back to WhatsApp handler');
        
        // Update the temporary message
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
        
        addSystemMessage(errorMessage, tempId);
        setIsLoading(false);
      }
    }
  }, [
    inputValue, 
    pendingAction, 
    isLoading,
    addUserMessage, 
    addSystemMessage, 
    clearInput, 
    fetchAIResponse, 
    fetchWhatsAppResponse, 
    handlePendingAction, 
    setIsLoading,
    retryAttempts,
    setTempMessageId,
    setRetryAttempts
  ]);

  // Render the chat interface using the children prop as a render function
  return children({
    messages,
    isLoading,
    pendingAction,
    handleSubmit
  });
};

export default ChatMessageHandler;
