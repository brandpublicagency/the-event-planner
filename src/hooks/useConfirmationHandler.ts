
import { useCallback } from "react";
import { PendingAction } from "@/types/chat";

interface UseConfirmationHandlerProps {
  addUserMessage: (message: string) => void;
  addSystemMessage: (message: string) => void;
  clearInput: () => void;
  handlePendingAction: (pendingAction: PendingAction, isConfirmed: boolean) => Promise<void>;
}

export const useConfirmationHandler = ({
  addUserMessage,
  addSystemMessage,
  clearInput,
  handlePendingAction
}: UseConfirmationHandlerProps) => {
  
  // Change the function signature to match what's expected by useChatMessageHandler
  const processConfirmation = useCallback((inputValue: string): boolean => {
    const isConfirming = 
      inputValue.toLowerCase().includes('yes') || 
      inputValue.toLowerCase().includes('confirm') ||
      inputValue.toLowerCase().includes('ok') ||
      inputValue.toLowerCase().includes('sure');
      
    const isDeclining = 
      inputValue.toLowerCase().includes('no') ||
      inputValue.toLowerCase().includes('cancel') ||
      inputValue.toLowerCase().includes('don\'t');
    
    // Only return true if the input was processed as a confirmation/denial
    return isConfirming || isDeclining;
  }, []);
  
  // Add the function that actually handles the confirmation logic
  const handleConfirmation = useCallback(async (
    inputValue: string, 
    pendingAction: PendingAction
  ) => {
    const isConfirming = 
      inputValue.toLowerCase().includes('yes') || 
      inputValue.toLowerCase().includes('confirm') ||
      inputValue.toLowerCase().includes('ok') ||
      inputValue.toLowerCase().includes('sure');
      
    const isDeclining = 
      inputValue.toLowerCase().includes('no') ||
      inputValue.toLowerCase().includes('cancel') ||
      inputValue.toLowerCase().includes('don\'t');
    
    // Add the user message to the chat
    addUserMessage(inputValue);
    clearInput();
    
    if (isConfirming) {
      // User confirmed the action
      await handlePendingAction(pendingAction, true);
    } else if (isDeclining) {
      // User declined the action
      await handlePendingAction(pendingAction, false);
    } else {
      // User didn't clearly confirm or decline
      addSystemMessage("Please confirm with 'yes' or decline with 'no'.");
    }
  }, [addUserMessage, addSystemMessage, clearInput, handlePendingAction]);
  
  return { processConfirmation, handleConfirmation };
};
