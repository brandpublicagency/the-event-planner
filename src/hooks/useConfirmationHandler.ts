
import { PendingAction, ChatMessage } from "@/types/chat";

interface UseConfirmationHandlerProps {
  addUserMessage: (message: string) => void;
  addSystemMessage: (message: string) => void;
  clearInput: () => void;
  handlePendingAction: (action: PendingAction, isConfirmed: boolean) => Promise<void>;
}

export const useConfirmationHandler = ({
  addUserMessage,
  addSystemMessage,
  clearInput,
  handlePendingAction
}: UseConfirmationHandlerProps) => {
  
  // Process confirmation returns a boolean indicating if it's a confirmation-related input
  const processConfirmation = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    
    // Check if the input is a confirmation or rejection
    return lowerInput.includes('yes') || 
           lowerInput.includes('no') || 
           lowerInput.includes('confirm') || 
           lowerInput.includes('cancel') || 
           lowerInput.includes('ok') || 
           lowerInput.includes('sure') ||
           lowerInput === 'y' ||
           lowerInput === 'n';
  };
  
  // Handle confirmation processes the action if confirmed, rejects if not
  const handleConfirmation = async (input: string, action: PendingAction): Promise<void> => {
    const lowerInput = input.toLowerCase();
    
    // Add the user's message
    addUserMessage(input);
    
    // Determine if the user is confirming or rejecting
    const isConfirming = 
      lowerInput.includes('yes') || 
      lowerInput.includes('confirm') || 
      lowerInput.includes('ok') || 
      lowerInput.includes('sure') ||
      lowerInput === 'y';
    
    // Process the action
    await handlePendingAction(action, isConfirming);
    
    // Clear the input
    clearInput();
  };

  return {
    processConfirmation,
    handleConfirmation
  };
};
