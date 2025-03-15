
import { useState } from 'react';
import { PendingAction } from "@/types/chat";
import { identifyActionFromAI } from "@/utils/chatActionParser";

interface MessageProcessorProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onClearInput: () => void;
}

export const useMessageProcessor = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput
}: MessageProcessorProps) => {
  const [tempMessageId, setTempMessageId] = useState<string | null>(null);
  
  const processAIResponse = async (message: string) => {
    try {
      // Check if the message contains action data
      const pendingAction = identifyActionFromAI(message);

      if (pendingAction) {
        console.log('Pending action identified:', pendingAction);
        // Clear any temporary message if we're setting a pending action
        if (tempMessageId) {
          // Replace the temporary message with the actual action request
          onAddSystemMessage(
            pendingAction.confirmationMessage || 
            "I'll need your confirmation to proceed with this action.", 
            tempMessageId
          );
          setTempMessageId(null);
        } else {
          // Add the confirmation message if no temp message exists
          onAddSystemMessage(
            pendingAction.confirmationMessage || 
            "I'll need your confirmation to proceed with this action."
          );
        }
        onSetPendingAction(pendingAction);
      } else {
        // If no action was identified, just display the message
        if (tempMessageId) {
          // Replace the temporary message with the actual response
          onAddSystemMessage(message, tempMessageId);
          setTempMessageId(null);
        } else {
          // Add as a new message
          onAddSystemMessage(message);
        }
      }
    } catch (error) {
      console.error('Error processing AI response:', error);
      onAddSystemMessage("I encountered an error processing that request. Please try again.");
    } finally {
      onSetIsLoading(false);
      onClearInput();
    }
  };

  return {
    tempMessageId,
    setTempMessageId,
    processAIResponse
  };
};
