
import { useState, useCallback } from "react";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { PendingAction } from "@/types/chat";
import { handleOpenAIRequest, prepareOpenAIMessages } from "@/utils/openaiUtils";
import { getChatContextData } from "@/services/chatContext";
import { getSystemMessage } from "@/utils/chat";

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

  const fetchAIResponse = async (inputText: string) => {
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

    // Generate system message with context data
    const systemMessage = getSystemMessage(
      data.eventsContext || 'No events data available.',
      data.contactsContext || 'No contacts data available.',
      data.documentsContext || 'No documents data available.',
      undefined, // PDF content
      data.tasksContext || 'No tasks data available.'
    );

    // Prepare the messages array for the OpenAI API
    const messages: ChatCompletionMessageParam[] = prepareOpenAIMessages(
      systemMessage,
      [], // We don't need to pass chat history as it's handled by the state
      inputText
    );

    // Handle the OpenAI request
    const response = await handleOpenAIRequest(
      messages,
      () => {
        console.log('AI request timed out, will use fallback mechanism');
        throw new Error('OpenAI API error: Request timed out');
      }
    );

    if (!response) {
      throw new Error('OpenAI API error: Empty response');
    }

    // Process the AI response
    if (processAIResponse) {
      processAIResponse(response);
    } else {
      // Default processing if processor not provided
      onSetIsLoading(false);
      onAddSystemMessage(response);
      onClearInput();
    }

    return response;
  };

  return { fetchAIResponse };
};
