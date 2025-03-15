
import { useState } from "react";
import { useChatState } from "@/hooks/useChatState";
import { useActionHandler } from "@/components/chat/handlers/ActionHandler";
import { useAIMessageHandler } from "@/components/chat/handlers/AIMessageHandler";
import { useWhatsAppMessageHandler } from "@/components/chat/handlers/WhatsAppMessageHandler";
import { useMessageProcessor } from "@/components/chat/handlers/MessageProcessor";
import { useRetryHandler } from "./useRetryHandler";
import { useSubmitHandler } from "./useSubmitHandler";
import { useConfirmationHandler } from "@/hooks/useConfirmationHandler";
import { ChatMessage, PendingAction } from "@/types/chat";

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
  
  // Use external state if provided, otherwise use internal state
  const inputValue = externalInputValue !== undefined ? externalInputValue : internalInputValue;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = internalSetIsLoading;
  const clearInput = externalClearInput || internalClearInput;
  const setInputValue = externalSetInputValue || ((value: string) => {});

  // Track temp message ID
  const [tempMessageId, setTempMessageId] = useState<string | null>(null);
  
  // Set up retry and fallback handlers
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
  
  // Set up message processor
  const { processAIResponse } = useMessageProcessor({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput
  });

  // Set up AI message handler
  const { fetchAIResponse, isStreaming } = useAIMessageHandler({
    onSetIsLoading: setIsLoading,
    onAddSystemMessage: addSystemMessage,
    onSetPendingAction: setPendingAction,
    onClearInput: clearInput,
    contextData,
    onSetTempMessageId: setTempMessageId,
    processAIResponse,
    forceLocalData: true // Force local data usage
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
  
  // Set up confirmation handler
  const { processConfirmation } = useConfirmationHandler({
    addUserMessage,
    addSystemMessage,
    clearInput,
    handlePendingAction
  });

  // Set up submission handler
  const { handleSubmit } = useSubmitHandler({
    inputValue,
    messages,
    pendingAction,
    isLoading,
    isStreaming,
    useStreamingMode: false, // Force non-streaming mode
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
    forceLocalData: true // Force local data usage
  });

  return {
    messages,
    isLoading: isLoading || isStreaming,
    pendingAction,
    handleSubmit
  };
};
