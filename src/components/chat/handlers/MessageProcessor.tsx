
import { useState, useCallback } from 'react';
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
  
  const processAIResponse = useCallback(async (message: string) => {
    try {
      console.log('Processing AI response:', message.substring(0, 100) + '...');
      
      // Check if the message contains action data
      const pendingAction = identifyActionFromAI(message);

      // Remove action JSON from the display message if present
      let displayMessage = message;
      
      // Clean up JSON code blocks
      if (pendingAction) {
        // Remove JSON block patterns
        const jsonBlockPattern = /```json\s*({\s*"action":.+?})\s*```/gs;
        displayMessage = displayMessage.replace(jsonBlockPattern, '');
        
        // Remove raw JSON objects that might be action data
        const jsonPattern = /(\{\s*"action"\s*:\s*"[^"]+"\s*,[\s\S]*?\})/g;
        displayMessage = displayMessage.replace(jsonPattern, '');
        
        // Clean up any double newlines or trailing whitespace
        displayMessage = displayMessage.replace(/\n{3,}/g, '\n\n').trim();
      }
      
      // Process file links from the AI
      const fileLinksPattern = /\[File: ([^\]]+)\]\(([^)]+)\)/g;
      displayMessage = displayMessage.replace(fileLinksPattern, '[File: $1]($2)');

      // First, show the AI's response
      if (tempMessageId) {
        // Replace the temporary message with the actual response
        onAddSystemMessage(displayMessage, tempMessageId);
      } else {
        // Add as a new message
        onAddSystemMessage(displayMessage);
      }
      
      // If there's an action, set it up as a pending action
      if (pendingAction) {
        console.log('Pending action identified:', pendingAction);
        
        // Add a separate confirmation message
        onAddSystemMessage(
          pendingAction.confirmationMessage || 
          "I'll need your confirmation to proceed with this action. Type 'yes' to confirm or 'no' to cancel."
        );
        
        onSetPendingAction(pendingAction);
      }
      
      // Reset loading state and temp message ID
      setTempMessageId(null);
      onSetIsLoading(false);
      onClearInput();
    } catch (error) {
      console.error('Error processing AI response:', error);
      
      // Show error message
      if (tempMessageId) {
        onAddSystemMessage("I encountered an error processing that request. Please try again.", tempMessageId);
      } else {
        onAddSystemMessage("I encountered an error processing that request. Please try again.");
      }
      
      // Reset state
      setTempMessageId(null);
      onSetIsLoading(false);
      onClearInput();
    }
  }, [tempMessageId, onAddSystemMessage, onSetPendingAction, onSetIsLoading, onClearInput]);

  return {
    tempMessageId,
    setTempMessageId,
    processAIResponse
  };
};
