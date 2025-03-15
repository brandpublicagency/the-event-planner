
import { useState, useCallback } from 'react';
import { useMessageProcessor } from './MessageProcessor';

interface AIMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: any | null) => void;
  onClearInput: () => void;
}

export const useAIMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput
}: AIMessageHandlerProps) => {
  const { tempMessageId, setTempMessageId, processAIResponse } = useMessageProcessor({
    onSetIsLoading,
    onAddSystemMessage,
    onSetPendingAction,
    onClearInput
  });

  const fetchAIResponse = useCallback(async (userMessage: string) => {
    onSetIsLoading(true);
    
    // Add a temporary message that will be replaced with the actual response
    const temporaryId = Date.now().toString();
    setTempMessageId(temporaryId);
    onAddSystemMessage("Thinking...", temporaryId);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the AI response through our message processor
      if (data.message) {
        await processAIResponse(data.message);
      } else {
        throw new Error('No message in response');
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      // Replace the temporary message with an error message
      onAddSystemMessage(
        "I'm having trouble connecting to the assistant. Please try again later.",
        temporaryId
      );
      setTempMessageId(null);
      onSetIsLoading(false);
    }
  }, [onSetIsLoading, onAddSystemMessage, processAIResponse, setTempMessageId]);

  return { fetchAIResponse };
};
