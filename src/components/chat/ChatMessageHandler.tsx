
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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

  // Improved function to directly fetch next event data
  const fetchNextEvent = async () => {
    try {
      console.log('Fetching next event directly');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Use a simpler query to avoid relationship errors
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          menu_selections (*)
        `)
        .gte('event_date', today.toISOString().split('T')[0])
        .is('deleted_at', null)
        .is('completed', false)
        .order('event_date', { ascending: true })
        .limit(1);
      
      if (error) {
        console.error('Error fetching next event:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return "No upcoming events found. Would you like me to help you create a new event?";
      }
      
      const event = data[0];
      console.log('Found next event:', event);
      
      // Format venue info
      let venueInfo = '';
      if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
        venueInfo = ` at ${event.venues.join(', ')}`;
      }
      
      // Format guest info
      let paxInfo = '';
      if (event.pax) {
        paxInfo = ` for ${event.pax} guests`;
      }
      
      // Format menu info if available
      let menuInfo = '';
      if (event.menu_selections) {
        const menuType = event.menu_selections.main_course_type || 
                        (event.menu_selections.is_custom ? 'Custom menu' : '');
        if (menuType) {
          menuInfo = `\nMenu: ${menuType}`;
        }
      }
      
      // Format contact info if available
      let contactInfo = '';
      if (event.primary_name || event.primary_email || event.primary_phone) {
        contactInfo = `\nPrimary Contact: ${event.primary_name || 'Not specified'}`;
        if (event.primary_email) contactInfo += `, Email: ${event.primary_email}`;
        if (event.primary_phone) contactInfo += `, Phone: ${event.primary_phone}`;
      }
      
      return `The next event is "${event.name}" (code: ${event.event_code}) on ${format(new Date(event.event_date), 'dd/MM/yyyy')}. 
It's a ${event.event_type} event${venueInfo}${paxInfo}.${menuInfo}${contactInfo}

You can update this event by asking me to change specific details like the guest count, date, venue, etc.`;
    } catch (error) {
      console.error('Error in fetchNextEvent:', error);
      return "I couldn't retrieve information about the next event right now. Please try asking about another topic or check your event list directly.";
    }
  };

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

      // Special case: directly handle next event query with improved reliability
      if (inputValue.toLowerCase().includes('next event') || 
          inputValue.toLowerCase().includes('upcoming event')) {
        console.log('Detected next event query, using direct fetch method');
        const nextEvent = await fetchNextEvent();
        addSystemMessage(nextEvent);
        setIsLoading(false);
        return;
      }

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

      // Check the type of response and handle accordingly
      if (response.type === 'text' && 'message' in response) {
        addSystemMessage(response.message);
      } else if (response.type === 'interactive' && 'interactive' in response) {
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
      } else {
        // Handle any other unexpected response format
        addSystemMessage("I received a response but couldn't format it properly. Please try a different query.");
      }
    } catch (error) {
      console.error('Error in WhatsApp fallback:', error);
      addSystemMessage("I'm sorry, I couldn't process your request at this time. Please try asking about specific events, tasks, or documents.");
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
