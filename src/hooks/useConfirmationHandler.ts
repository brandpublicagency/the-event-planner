
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
  
  const processConfirmation = useCallback(async (
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
  
  return { processConfirmation };
};
