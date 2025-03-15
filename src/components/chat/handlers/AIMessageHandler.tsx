
import { useState, useCallback, useRef } from "react";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { PendingAction, ChatMessage } from "@/types/chat";
import { handleOpenAIRequest, prepareOpenAIMessages } from "@/utils/openaiUtils";
import { getChatCompletion } from "@/services/openai";
import { getChatContextData } from "@/services/chatContext";
import { getSystemMessage } from "@/utils/chat";
import { supabase } from "@/integrations/supabase/client";

interface AIMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onClearInput: () => void;
  contextData?: any;
  onSetTempMessageId?: (id: string | null) => void;
  processAIResponse?: (message: string) => void;
  forceLocalData?: boolean;
}

export const useAIMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput,
  contextData: externalContextData,
  onSetTempMessageId,
  processAIResponse,
  forceLocalData = true // Force local data by default
}: AIMessageHandlerProps) => {
  const [contextData, setContextData] = useState<any>(externalContextData || null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Function to get upcoming events directly from the database
  const getUpcomingEvents = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gt('event_date', today.toISOString())
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
        .limit(5);
        
      if (error) {
        console.error('Error fetching events:', error);
        return "I couldn't retrieve event information at the moment. Please try again shortly.";
      }
      
      if (!events || events.length === 0) {
        return "There are no upcoming events scheduled at this time.";
      }
      
      // Get the next event
      const nextEvent = events[0];
      const eventDate = nextEvent.event_date ? new Date(nextEvent.event_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : 'date not specified';
      
      // Format venue information if available
      let venueInfo = '';
      if (nextEvent.venues && nextEvent.venues.length > 0) {
        venueInfo = `\nVenue: ${Array.isArray(nextEvent.venues) ? nextEvent.venues.join(', ') : nextEvent.venues}`;
      }
      
      return `The next event is "${nextEvent.name}" (${nextEvent.event_code}) on ${eventDate}.${venueInfo}\nGuests: ${nextEvent.pax || 'Not specified'}`;
    } catch (err) {
      console.error('Error in getUpcomingEvents:', err);
      return "I encountered an error trying to fetch event information. Please try again.";
    }
  };

  // Get menu for a specific event - new function
  const getEventMenu = async (eventNameOrCode: string) => {
    try {
      console.log(`Searching for menu info for event: ${eventNameOrCode}`);
      
      // Try to find the event by name or code
      const { data: events, error } = await supabase
        .from('events')
        .select('*, menu_selections(*)')
        .or(`name.ilike.%${eventNameOrCode}%,event_code.ilike.%${eventNameOrCode}%`)
        .is('deleted_at', null)
        .limit(1);
      
      if (error) {
        console.error('Error fetching event by name:', error);
        return `I couldn't find menu information for "${eventNameOrCode}". Please try again with the exact event name or code.`;
      }
      
      if (!events || events.length === 0) {
        return `I couldn't find an event matching "${eventNameOrCode}". Please check the spelling or try with the event code.`;
      }
      
      const event = events[0];
      
      // Check if there's menu data
      if (!event.menu_selections) {
        return `The event "${event.name}" (${event.event_code}) doesn't have any menu selections yet.`;
      }
      
      const menu = event.menu_selections;
      
      // Format the menu details
      let menuDetails = `Here's the menu for "${event.name}" (${event.event_code}):\n\n`;
      
      if (menu.is_custom) {
        menuDetails += `This event has a custom menu:\n${menu.custom_menu_details || 'Details not specified'}`;
      } else {
        // Add starter information
        if (menu.starter_type) {
          if (menu.starter_type === 'canapes') {
            menuDetails += `**Starter:** Canapés\n`;
            if (menu.canape_package) {
              menuDetails += `**Package:** ${menu.canape_package}\n`;
            }
            if (menu.canape_selections && menu.canape_selections.length > 0) {
              menuDetails += `**Selections:** ${menu.canape_selections.join(', ')}\n`;
            }
          } else if (menu.starter_type === 'plated') {
            menuDetails += `**Starter:** Plated starter\n`;
            if (menu.plated_starter) {
              menuDetails += `**Selection:** ${menu.plated_starter}\n`;
            }
          }
        }
        
        // Add main course information
        if (menu.main_course_type) {
          menuDetails += `\n**Main Course:** ${menu.main_course_type}\n`;
          
          if (menu.main_course_type === 'buffet') {
            if (menu.buffet_meat_selections && menu.buffet_meat_selections.length > 0) {
              menuDetails += `**Meat:** ${menu.buffet_meat_selections.join(', ')}\n`;
            }
            if (menu.buffet_starch_selections && menu.buffet_starch_selections.length > 0) {
              menuDetails += `**Starch:** ${menu.buffet_starch_selections.join(', ')}\n`;
            }
            if (menu.buffet_vegetable_selections && menu.buffet_vegetable_selections.length > 0) {
              menuDetails += `**Vegetables:** ${menu.buffet_vegetable_selections.join(', ')}\n`;
            }
            if (menu.buffet_salad_selection) {
              menuDetails += `**Salad:** ${menu.buffet_salad_selection}\n`;
            }
          } else if (menu.main_course_type === 'plated') {
            if (menu.plated_main_selection) {
              menuDetails += `**Selection:** ${menu.plated_main_selection}\n`;
            }
            if (menu.plated_salad_selection) {
              menuDetails += `**Salad:** ${menu.plated_salad_selection}\n`;
            }
          } else if (menu.main_course_type === 'karoo') {
            if (menu.karoo_meat_selection) {
              menuDetails += `**Meat:** ${menu.karoo_meat_selection}\n`;
            }
            if (menu.karoo_starch_selection && menu.karoo_starch_selection.length > 0) {
              menuDetails += `**Starch:** ${menu.karoo_starch_selection.join(', ')}\n`;
            }
            if (menu.karoo_vegetable_selections && menu.karoo_vegetable_selections.length > 0) {
              menuDetails += `**Vegetables:** ${menu.karoo_vegetable_selections.join(', ')}\n`;
            }
            if (menu.karoo_salad_selection) {
              menuDetails += `**Salad:** ${menu.karoo_salad_selection}\n`;
            }
          }
        }
        
        // Add dessert information
        if (menu.dessert_type) {
          menuDetails += `\n**Dessert:** ${menu.dessert_type}\n`;
          
          if (menu.dessert_type === 'traditional' && menu.traditional_dessert) {
            menuDetails += `**Selection:** ${menu.traditional_dessert}\n`;
          } else if (menu.dessert_type === 'individual_cakes' && menu.individual_cakes) {
            menuDetails += `**Selections:** ${menu.individual_cakes.join(', ')}\n`;
          } else if (menu.dessert_type === 'canape_desserts' && menu.dessert_canapes) {
            menuDetails += `**Selections:** ${menu.dessert_canapes.join(', ')}\n`;
          }
        }
      }
      
      // Add notes if any
      if (menu.notes) {
        menuDetails += `\n**Additional Notes:**\n${menu.notes}`;
      }
      
      return menuDetails;
      
    } catch (err) {
      console.error('Error in getEventMenu:', err);
      return `I encountered an error trying to fetch menu information. Please try again.`;
    }
  };

  // Handle questions about specific event types
  const getEventsByType = async (eventType) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_type', eventType)
        .gt('event_date', today.toISOString())
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
        .limit(10);
        
      if (error) {
        console.error(`Error fetching ${eventType} events:`, error);
        return `I couldn't retrieve ${eventType} information at the moment.`;
      }
      
      if (!events || events.length === 0) {
        return `There are no upcoming ${eventType} events scheduled.`;
      }
      
      const eventsList = events.map(event => {
        const eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'date not specified';
        
        return `• ${event.name} (${event.event_code}) - ${eventDate} - Guests: ${event.pax || 'Not specified'}`;
      }).join('\n');
      
      return `Here are the upcoming ${eventType} events:\n\n${eventsList}`;
    } catch (err) {
      console.error(`Error in getEventsByType for ${eventType}:`, err);
      return `I encountered an error trying to fetch ${eventType} information.`;
    }
  };

  // Handle specific date queries
  const getEventsByMonth = async (month) => {
    try {
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      const monthIndex = months.indexOf(month.toLowerCase());
      if (monthIndex === -1) {
        return `I couldn't find events for '${month}'. Please specify a valid month.`;
      }
      
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, monthIndex, 1).toISOString();
      const endDate = new Date(currentYear, monthIndex + 1, 0).toISOString();
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });
        
      if (error) {
        console.error(`Error fetching events for ${month}:`, error);
        return `I couldn't retrieve event information for ${month} at the moment.`;
      }
      
      if (!events || events.length === 0) {
        return `There are no events scheduled in ${month}.`;
      }
      
      const eventsList = events.map(event => {
        const eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'date not specified';
        
        return `• ${event.name} (${event.event_code}) - ${eventDate} - Guests: ${event.pax || 'Not specified'}`;
      }).join('\n');
      
      return `Here are the events scheduled in ${month}:\n\n${eventsList}`;
    } catch (err) {
      console.error(`Error in getEventsByMonth for ${month}:`, err);
      return `I encountered an error trying to fetch event information for ${month}.`;
    }
  };

  // Simple responder for common event questions
  const getBasicEventResponse = async (inputText: string) => {
    const lowerInput = inputText.toLowerCase();
    
    // Check for menu questions
    if ((lowerInput.includes('menu') || lowerInput.includes('food')) && 
        (lowerInput.includes('for') || lowerInput.includes('of'))) {
      // Extract the event name
      const eventNameMatch = lowerInput.match(/menu\s+(?:for|of)\s+(?:the\s+)?([a-z0-9\s-]+)(\s+event)?/i) || 
                           lowerInput.match(/(?:the\s+)?([a-z0-9\s-]+)(?:\s+event)?\s+menu/i) ||
                           lowerInput.match(/food\s+(?:for|of)\s+(?:the\s+)?([a-z0-9\s-]+)(\s+event)?/i);
      
      if (eventNameMatch && eventNameMatch[1]) {
        const eventName = eventNameMatch[1].trim();
        return await getEventMenu(eventName);
      }
    }
    
    // Check for next event questions
    if (lowerInput.includes('next event') || 
        (lowerInput.includes('when') && lowerInput.includes('event')) ||
        (lowerInput.includes('upcoming') && lowerInput.includes('event'))) {
      return await getUpcomingEvents();
    }
    
    // Check for event type questions
    const eventTypes = ['Wedding', 'Conference', 'Year-End Function', 'Corporate Function', 
                        'Babyshower', 'Kitchen Tea', 'Party', 'Concert', 'Performance', 'Private Event'];
    
    for (const type of eventTypes) {
      if (lowerInput.includes(type.toLowerCase())) {
        return await getEventsByType(type);
      }
    }
    
    // Check for month-specific queries
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    for (const month of months) {
      if (lowerInput.includes(month)) {
        return await getEventsByMonth(month);
      }
    }
    
    // Event code pattern like EVENT-001-123
    const eventCodePattern = /EVENT-\d{3}-\d{3}/i;
    const eventCodeMatch = inputText.match(eventCodePattern);
    
    if (eventCodeMatch) {
      const eventCode = eventCodeMatch[0];
      
      try {
        // If it's asking about menu for an event by code
        if (lowerInput.includes('menu') || lowerInput.includes('food')) {
          return await getEventMenu(eventCode);
        }
        
        const { data: event, error } = await supabase
          .from('events')
          .select('*')
          .eq('event_code', eventCode)
          .single();
          
        if (error || !event) {
          return `I couldn't find an event with the code ${eventCode}.`;
        }
        
        const eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'date not specified';
        
        let venueInfo = '';
        if (event.venues && event.venues.length > 0) {
          venueInfo = `\nVenue: ${Array.isArray(event.venues) ? event.venues.join(', ') : event.venues}`;
        }
        
        return `Event "${event.name}" (${event.event_code}):\nDate: ${eventDate}${venueInfo}\nGuests: ${event.pax || 'Not specified'}\nType: ${event.event_type || 'Not specified'}`;
      } catch (err) {
        console.error('Error fetching event by code:', err);
        return `I encountered an error trying to fetch information for event ${eventCode}.`;
      }
    }
    
    return null; // Return null if no basic response is available
  };

  const fetchAIResponse = async (inputText: string, messages?: ChatMessage[]): Promise<void> => {
    try {
      // Generate a temporary message ID for updating
      const tempId = String(Date.now());
      if (onSetTempMessageId) {
        onSetTempMessageId(tempId);
      }
      
      // Show initial loading message
      onAddSystemMessage("Thinking...", tempId);
      
      // Try to generate a basic response first for common queries
      const basicResponse = await getBasicEventResponse(inputText);
      if (basicResponse) {
        onSetIsLoading(false);
        onAddSystemMessage(basicResponse, tempId);
        onClearInput();
        return;
      }

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
      const apiMessages: ChatCompletionMessageParam[] = prepareOpenAIMessages(
        systemMessage,
        messages || [], // Use provided messages history if available
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
        
        // Try more basic response as fallback
        const basicResponse = await getUpcomingEvents();
        if (basicResponse) {
          onSetIsLoading(false);
          onAddSystemMessage("I couldn't process your specific query, but here's information about your next event:\n\n" + basicResponse, tempId);
          onClearInput();
          return;
        }
        
        // Implement retry logic for recoverable errors
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          onAddSystemMessage(`I'm having trouble processing your request. Let me try again...`, tempId);
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          
          // Recursive retry
          return fetchAIResponse(inputText);
        }
        
        // If max retries exceeded, show error message
        onSetIsLoading(false);
        onAddSystemMessage(
          "I'm having trouble generating a response right now. Please try asking about specific events by name or code for better results.",
          tempId
        );
        onClearInput();
        throw error;
      }
    } catch (error) {
      console.error('Error in fetchAIResponse:', error);
      onSetIsLoading(false);
      onAddSystemMessage("I encountered an error. Please try asking about specific events like 'Show me events in July' or 'What's my next wedding event?'");
      onClearInput();
      throw error;
    }
  };

  return { fetchAIResponse, isStreaming: false };
};
