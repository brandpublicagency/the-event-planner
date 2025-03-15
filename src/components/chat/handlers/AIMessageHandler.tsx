
import { useState, useCallback } from "react";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { PendingAction } from "@/types/chat";
import { handleOpenAIRequest, prepareOpenAIMessages } from "@/utils/openaiUtils";
import { getChatContextData } from "@/services/chatContext";

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

  // Generate the system message for the AI
  const generateSystemMessage = (contextData: any): string => {
    if (!contextData) return "You are a helpful assistant for the event management system.";
    
    const { events, contacts, documents, tasks } = contextData;
    
    let systemMessage = `
    You are a helpful assistant for our event management system.
    Current date: ${new Date().toISOString().split('T')[0]}
    
    You have FULL ACCESS to make any changes to events, tasks, documents and contacts.`;
    
    // Add event data if available
    if (events && events.length > 0) {
      systemMessage += `\n\nEVENTS (${events.length} total):\n`;
      events.slice(0, 10).forEach((event: any, index: number) => {
        const eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString() : 'No date set';
        systemMessage += `${index + 1}. [${event.event_code}] ${event.name} - ${eventDate} - Type: ${event.event_type}, Guests: ${event.pax || 'Unknown'}\n`;
      });
      if (events.length > 10) {
        systemMessage += `... and ${events.length - 10} more events.\n`;
      }
    } else {
      systemMessage += "\nNo upcoming events found.\n";
    }
    
    // Add task data if available
    if (tasks && tasks.length > 0) {
      systemMessage += `\n\nTASKS (${tasks.length} total):\n`;
      tasks.slice(0, 5).forEach((task: any, index: number) => {
        const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';
        systemMessage += `${index + 1}. ${task.title} - Due: ${dueDate} - ${task.completed ? 'COMPLETED' : 'PENDING'}\n`;
      });
      if (tasks.length > 5) {
        systemMessage += `... and ${tasks.length - 5} more tasks.\n`;
      }
    }
    
    // Include information about actions the assistant can perform
    systemMessage += `
    \nYou can perform actions such as:
    1. Update event details (e.g., change date, number of guests, venue)
    2. Create or modify tasks
    3. Send emails
    4. Update menus
    
    When you need to perform an action, include a JSON block with the action details.
    For example:
    
    \`\`\`json
    {
      "action": "update_event",
      "event_code": "EVENT-123",
      "updates": {
        "pax": 50,
        "venue": "The Gallery"
      }
    }
    \`\`\`
    
    I will confirm before executing any action. Be concise but helpful in your responses.
    `;
    
    return systemMessage;
  };

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
        data = { events: [], contacts: [], documents: [], tasks: [] };
      }
    }

    // Generate system message with context data
    const systemMessage = generateSystemMessage(data);

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
