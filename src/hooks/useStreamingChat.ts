
import { useState, useCallback, useRef } from 'react';
import { ChatMessage, PendingAction } from '@/types/chat';
import { streamChatCompletion, getChatFunctionDefinitions, StreamProcessor } from '@/services/chatStream';
import { identifyActionFromAI } from "@/utils/chatActionParser";
import { getSystemMessage } from '@/utils/chat';

interface UseStreamingChatProps {
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onSetIsLoading: (isLoading: boolean) => void;
  contextData?: any;
}

export function useStreamingChat({
  onAddSystemMessage,
  onSetPendingAction,
  onSetIsLoading,
  contextData
}: UseStreamingChatProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingMessageId = useRef<string | null>(null);
  const completeMessageContent = useRef<string>('');

  const streamResponse = useCallback(async (
    messages: ChatMessage[],
    tempMessageId: string
  ) => {
    // Reset state
    setError(null);
    setIsStreaming(true);
    streamingMessageId.current = tempMessageId;
    completeMessageContent.current = '';
    
    if (!contextData) {
      onAddSystemMessage(
        "I don't have access to your data right now. Please try again in a moment.",
        tempMessageId
      );
      setIsStreaming(false);
      onSetIsLoading(false);
      return;
    }
    
    // Generate system message with context data
    const systemMessage = getSystemMessage(
      contextData.eventsContext || 'No events data available.',
      contextData.contactsContext || 'No contacts data available.',
      contextData.documentsContext || 'No documents data available.',
      undefined, // PDF content
      contextData.tasksContext || 'No tasks data available.'
    );
    
    // Get function definitions
    const functionDefs = getChatFunctionDefinitions();
    
    try {
      // Create the processor object that handles streaming events
      const processor: StreamProcessor = {
        onContent: (content) => {
          completeMessageContent.current += content;
          onAddSystemMessage(completeMessageContent.current, tempMessageId);
        },
        onFunctionCall: (functionCall) => {
          try {
            console.log('Function call from streaming API:', functionCall);
            
            // Format function call to our standard format
            if (functionCall.name === "update_event") {
              const args = JSON.parse(functionCall.arguments);
              const message = `I'll update the event ${args.event_code} with the following changes: ${JSON.stringify(args.updates)}.\n\n{"action":"update_event","event_code":"${args.event_code}","updates":${JSON.stringify(args.updates)}}`;
              completeMessageContent.current = message;
              onAddSystemMessage(message, tempMessageId);
            } else if (functionCall.name === "update_menu") {
              const args = JSON.parse(functionCall.arguments);
              const message = `I'll update the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\n{"action":"update_menu","event_code":"${args.event_code}","menu_updates":${JSON.stringify(args.menu_updates)}}`;
              completeMessageContent.current = message;
              onAddSystemMessage(message, tempMessageId);
            } else if (functionCall.name === "create_task") {
              const args = JSON.parse(functionCall.arguments);
              const message = `I'll create a new task: "${args.title}".\n\n{"action":"create_task","task_data":${JSON.stringify(args)}}`;
              completeMessageContent.current = message;
              onAddSystemMessage(message, tempMessageId);
            }
          } catch (error) {
            console.error('Error processing function call:', error);
            completeMessageContent.current += "\n\nI attempted to perform an action but encountered an error. Please try again with more specific instructions.";
            onAddSystemMessage(completeMessageContent.current, tempMessageId);
          }
        },
        onError: (errorMessage) => {
          console.error('Streaming error:', errorMessage);
          setError(errorMessage);
          onAddSystemMessage(
            "I encountered an error while generating a response. Please try again.",
            tempMessageId
          );
        },
        onComplete: () => {
          console.log('Streaming complete');
          
          // Identify any actions in the final response
          const pendingAction = identifyActionFromAI(completeMessageContent.current);
          if (pendingAction) {
            console.log('Pending action identified:', pendingAction);
            
            // Add a separate confirmation message
            onAddSystemMessage(
              pendingAction.confirmationMessage || 
              "I'll need your confirmation to proceed with this action. Type 'yes' to confirm or 'no' to cancel."
            );
            
            onSetPendingAction(pendingAction);
          }
          
          // Finish streaming
          setIsStreaming(false);
          streamingMessageId.current = null;
          onSetIsLoading(false);
        }
      };

      // Call the streamChatCompletion function with the correct parameter order
      await streamChatCompletion(
        messages, 
        systemMessage,
        processor,
        functionDefs
      );
    } catch (error) {
      console.error('Error in streamResponse:', error);
      setError(error.message || 'Unknown error');
      onAddSystemMessage(
        "I encountered an error while generating a response. Please try again.",
        tempMessageId
      );
      setIsStreaming(false);
      streamingMessageId.current = null;
      onSetIsLoading(false);
    }
  }, [contextData, onAddSystemMessage, onSetIsLoading, onSetPendingAction]);

  return {
    streamResponse,
    isStreaming,
    error
  };
}
