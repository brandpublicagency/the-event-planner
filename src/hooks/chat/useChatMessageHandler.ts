
import { useState } from "react";
import { useChatState } from "@/hooks/useChatState";
import { useAIMessageHandler } from "@/components/chat/handlers/AIMessageHandler";
import { useWhatsAppMessageHandler } from "@/components/chat/handlers/WhatsAppMessageHandler";
import { useMessageProcessor } from "@/components/chat/handlers/MessageProcessor";
import { useRetryHandler } from "./useRetryHandler";
import { useSubmitHandler } from "./useSubmitHandler";
import { useConfirmationHandler } from "@/hooks/useConfirmationHandler";
import { ChatMessage, PendingAction } from "@/types/chat";

// Import from utils or a mock implementation if not found
import { handlePendingAction } from "@/utils/chatActionHandler";

interface UseChatMessageHandlerProps {
  contextData?: any;
  inputValue?: string;
  isLoading?: boolean;
  setInputValue?: (value: string) => void;
  clearInput?: () => void;
  forceLocalData?: boolean;
}

export const useChatMessageHandler = ({
  contextData,
  inputValue: externalInputValue,
  isLoading: externalIsLoading,
  setInputValue: externalSetInputValue,
  clearInput: externalClearInput,
  forceLocalData = true // Changed default to true to force local data
}: UseChatMessageHandlerProps) => {
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
  
  const inputValue = externalInputValue !== undefined ? externalInputValue : internalInputValue;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = internalSetIsLoading;
  const clearInput = externalClearInput || internalClearInput;
  const setInputValue = externalSetInputValue || ((value: string) => {});

  const [tempMessageId, setTempMessageId] = useState<string | null>(null);
  
  const {
    retryAttempts,
    setRetryAttempts,
    useStreamingMode,
    setUseStreamingMode,
    handleError
  } = useRetryHandler({
    onAddSystemMessage: addSystemMessage,
    onSetIsLoading: setIsLoading
  });
  
  const { processAIResponse } = useMessageProcessor({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput
  });

  const { fetchAIResponse, isStreaming } = useAIMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput,
    contextData,
    onSetTempMessageId: setTempMessageId,
    processAIResponse,
    forceLocalData: true
  });

  const { fetchWhatsAppResponse } = useWhatsAppMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput,
    contextData
  });

  // Handle pending actions with proper type handling
  const actionHandler = async (action: PendingAction, isConfirmed: boolean): Promise<void> => {
    try {
      await handlePendingAction(action, isConfirmed);
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };
  
  const { processConfirmation, handleConfirmation } = useConfirmationHandler({
    addUserMessage,
    addSystemMessage,
    clearInput,
    handlePendingAction: actionHandler
  });

  const { handleSubmit } = useSubmitHandler({
    inputValue,
    messages,
    pendingAction,
    isLoading,
    isStreaming,
    useStreamingMode: false,
    addUserMessage,
    clearInput,
    setIsLoading,
    handlePendingAction: actionHandler,
    fetchAIResponse,
    fetchWhatsAppResponse,
    processConfirmation,
    handleConfirmation,
    setUseStreamingMode,
    setRetryAttempts,
    setTempMessageId,
    addSystemMessage,
    retryAttempts,
    tempMessageId,
    forceLocalData: true
  });

  return {
    messages,
    isLoading: isLoading || isStreaming,
    pendingAction,
    handleSubmit
  };
};
