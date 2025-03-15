
import { useState } from 'react';
import { useMessageProcessor } from './MessageProcessor';
import { PendingAction } from '@/types/chat';

interface AIMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, id?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onClearInput: () => void;
  contextData?: any;
}

export const useAIMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput,
  contextData
}: AIMessageHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    tempMessageId,
    setTempMessageId,
    processAIResponse 
  } = useMessageProcessor({
    onSetIsLoading,
    onAddSystemMessage,
    onSetPendingAction,
    onClearInput
  });

  const fetchAIResponse = async (userMessage: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      onSetIsLoading(true);
      
      // Add a loading message that we'll replace later
      const loadingMessageId = Date.now().toString();
      setTempMessageId(loadingMessageId);
      onAddSystemMessage('Thinking...', loadingMessageId);
      
      // Prepare context data for the AI request
      const contextInfo = contextData ? JSON.stringify(contextData) : '{}';
      
      // Call OpenAI API through our backend
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          contextData: contextInfo
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Process the AI response with our message processor
      await processAIResponse(data.message || data.content || "I'm sorry, I couldn't process that request.");
      
    } catch (error) {
      console.error('Error in AI response:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return { fetchAIResponse };
};
