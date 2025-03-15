
import { useState, useCallback } from "react";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { PendingAction, ChatMessage } from "@/types/chat";
import { handleOpenAIRequest, prepareOpenAIMessages } from "@/utils/openaiUtils";
import { getChatCompletion } from "@/services/openai";
import { getChatContextData } from "@/services/chatContext";
import { getSystemMessage } from "@/utils/chat";
import { useStreamingChat } from "@/hooks/useStreamingChat";

interface AIMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onClearInput: () => void;
  contextData?: any;
  onSetTempMessageId?: (id: string | null) => void;
  processAIResponse?: (message: string) => void;
}

export const useAIMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput,
  contextData: externalContextData,
  onSetTempMessageId,
  processAIResponse
}: AIMessageHandlerProps) => {
  const [contextData, setContextData] = useState<any>(externalContextData || null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Get streaming functionality
  const { streamResponse, isStreaming } = useStreamingChat({
    onAddSystemMessage,
    onSetPendingAction,
    onSetIsLoading,
    contextData: contextData || externalContextData
  });

  const fetchAIResponse = async (inputText: string, messages?: ChatMessage[]): Promise<void> => {
    try {
      // Get context data if not provided
      let data = contextData;
      if (!data) {
        try {
          data = await getChatContextData();
          setContextData(data);
          console.log('Chat context data fetched:', 
            `${data.events?.length || 0} events, ` +
            `${data.contacts?.length || 0} contacts, ` +
            `${data.documents?.length || 0} documents, ` +
            `${data.tasks?.length || 0} tasks`
          );
        } catch (error) {
          console.error('Error fetching chat context data:', error);
          // Continue with empty context data
          data = { 
            events: [], 
            contacts: [], 
            documents: [], 
            tasks: [], 
            eventsContext: 'No events data available.',
            contactsContext: 'No contacts data available.',
            documentsContext: 'No documents data available.',
            tasksContext: 'No tasks data available.'
          };
        }
      }

      // Generate a temporary message ID for updating
      const tempId = String(Date.now());
      if (onSetTempMessageId) {
        onSetTempMessageId(tempId);
      }
      
      // Show initial loading message
      onAddSystemMessage("Thinking...", tempId);
      
      // Use streaming if available and messages are provided
      if (messages) {
        console.log('Using streaming response for chat');
        await streamResponse(messages, tempId);
        return;
      }

      // Generate system message with context data
      const systemMessage = getSystemMessage(
        data.eventsContext || 'No events data available.',
        data.contactsContext || 'No contacts data available.',
        data.documentsContext || 'No documents data available.',
        undefined, // PDF content
        data.tasksContext || 'No tasks data available.'
      );

      // Prepare the messages array for the OpenAI API
      const apiMessages: ChatCompletionMessageParam[] = prepareOpenAIMessages(
        systemMessage,
        [], // We don't need to pass chat history as it's handled by the state
        inputText
      );

      // Make the request to OpenAI
      try {
        const response = await getChatCompletion(apiMessages);
        
        if (!response) {
          throw new Error('Empty response from OpenAI');
        }

        // Reset retry counter on success
        setRetryCount(0);

        // Process the AI response
        if (processAIResponse) {
          processAIResponse(response);
        } else {
          // Default processing if processor not provided
          onSetIsLoading(false);
          onAddSystemMessage(response, tempId);
          onClearInput();
        }
        
        return;
      } catch (error) {
        console.error('Error in OpenAI request:', error);
        
        // Implement retry logic for recoverable errors
        if (retryCount < MAX_RETRIES && 
            (error.message?.includes('timeout') || 
             error.message?.includes('rate limit') || 
             error.message?.includes('network'))) {
          
          setRetryCount(prev => prev + 1);
          onAddSystemMessage(`I'm having trouble connecting to our AI service. Retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`, tempId);
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          
          // Recursive retry
          return fetchAIResponse(inputText);
        }
        
        // If max retries exceeded or unrecoverable error, show error message
        onSetIsLoading(false);
        onAddSystemMessage(
          "I'm having trouble generating a response right now. This might be due to high demand or a temporary service issue. Please try again in a moment.",
          tempId
        );
        onClearInput();
        throw error;
      }
    } catch (error) {
      console.error('Error in fetchAIResponse:', error);
      onSetIsLoading(false);
      onAddSystemMessage("I encountered an error. Please try again or contact support if the issue persists.");
      onClearInput();
      throw error;
    }
  };

  return { fetchAIResponse, isStreaming };
};
