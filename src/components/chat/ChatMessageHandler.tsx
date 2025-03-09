
import { useChatState } from "@/hooks/useChatState";
import { useTaskContext } from "@/contexts/TaskContext";
import { 
  prepareEventsContext, 
  prepareTasksContext, 
  prepareContactsContext,
  prepareDocumentsContext,
  getSystemMessage 
} from "@/utils/chat";
import ChatInput from "./ChatInput";
import { handleMessage } from "@/utils/whatsappUtils";
import { useActionHandler } from "./handlers/ActionHandler";
import { getChatCompletion } from "@/services/openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useState, useEffect } from "react";

interface ChatMessageHandlerProps {
  contextData: any;
  inputValue: string;
  isLoading: boolean;
  setInputValue: (value: string) => void;
  clearInput: () => void;
}

export const ChatMessageHandler = ({
  contextData,
  inputValue,
  isLoading,
  setInputValue,
  clearInput,
}: ChatMessageHandlerProps) => {
  const {
    pendingAction,
    setPendingAction,
    addUserMessage,
    addSystemMessage,
    messages: chatMessages,
    setIsLoading,
    toast
  } = useChatState();

  const { tasks } = useTaskContext();
  const { handlePendingAction } = useActionHandler();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  // When contextData changes, check if it's ready to use
  useEffect(() => {
    if (contextData) {
      const hasEvents = contextData.events && Array.isArray(contextData.events) && contextData.events.length > 0;
      const hasContacts = contextData.contacts && Array.isArray(contextData.contacts);
      const hasDocuments = contextData.documents && Array.isArray(contextData.documents);
      
      // Check if we have at least some minimal data to work with
      setDataReady(hasEvents || hasContacts || hasDocuments);
      
      console.log('Context data loaded:', {
        events: contextData.events?.length || 0,
        contacts: contextData.contacts?.length || 0,
        documents: contextData.documents?.length || 0,
        tasks: contextData.tasks?.length || 0,
        pdfContent: contextData.pdfContent ? 'Available' : 'Not available',
        dataReady: hasEvents || hasContacts || hasDocuments
      });
    }
  }, [contextData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with input:', inputValue);
    
    if (!inputValue.trim()) {
      console.log('Empty input, skipping submission');
      return;
    }

    try {
      // Add user message immediately and clear input
      console.log('Adding user message:', inputValue);
      addUserMessage(inputValue);
      clearInput();
      setIsLoading(true);

      // Check if we should use fallback immediately
      const useWhatsAppFallback = !aiEnabled || !contextData || !dataReady;
      
      if (useWhatsAppFallback) {
        console.log('Using WhatsApp fallback directly due to:', {
          aiEnabled,
          contextDataAvailable: !!contextData,
          dataReady
        });
        await handleWhatsAppFallback();
        setIsLoading(false);
        return;
      }

      // Prepare comprehensive context for the AI
      const eventsContext = contextData?.events ? prepareEventsContext(contextData.events) : "No events data available.";
      const contactsContext = contextData?.contacts ? prepareContactsContext(contextData.contacts) : "No contacts data available.";
      const documentsContext = contextData?.documents ? prepareDocumentsContext(contextData.documents) : "No documents data available.";
      const tasksContext = tasks ? prepareTasksContext(tasks) : "No tasks data available.";
      
      console.log('Prepared context for AI:', {
        eventsContextLength: eventsContext.length,
        contactsContextLength: contactsContext.length,
        documentsContextLength: documentsContext.length,
        tasksContextLength: tasksContext ? tasksContext.length : 0,
        pdfContentAvailable: contextData?.pdfContent ? true : false
      });
      
      const systemMessage = getSystemMessage(
        eventsContext, 
        contactsContext,
        documentsContext,
        contextData?.pdfContent, 
        tasksContext
      );

      // Try to get a response from OpenAI
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemMessage } as const,
        ...chatMessages.map(msg => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        })),
        { role: "user" as const, content: inputValue }
      ];

      console.log('Sending chat request with full context');
      const aiResponse = await getChatCompletion(messages);
      
      if (aiResponse) {
        console.log('Received AI response:', aiResponse.substring(0, 100) + '...');
        addSystemMessage(aiResponse);
      } else {
        console.warn('No AI response received, falling back to WhatsApp handler');
        await handleWhatsAppFallback();
      }
    } catch (error: any) {
      console.error('Error in chat completion:', error);
      await handleWhatsAppFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppFallback = async () => {
    try {
      // Fallback to WhatsApp handler
      const response = await handleMessage({
        type: 'text',
        text: { body: inputValue }
      });

      console.log('Received response from WhatsApp handler:', response);

      if (response.type === 'text') {
        addSystemMessage(response.message);
      } else if (response.type === 'interactive') {
        const message = response.interactive.body.text;
        addSystemMessage(message);
        
        if (response.interactive.action?.sections) {
          const listOptions = response.interactive.action.sections
            .map(section => {
              const sectionItems = section.rows
                .map(row => `- ${row.title}: ${row.description}`)
                .join('\n');
              return `${section.title}:\n${sectionItems}`;
            })
            .join('\n\n');
          
          addSystemMessage(`Available options:\n${listOptions}`);
        }
      }
    } catch (error) {
      console.error('Error in WhatsApp fallback:', error);
      addSystemMessage("I'm sorry, I couldn't process your request at this time.");
    }
  };

  return (
    <ChatInput
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
