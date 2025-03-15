
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  prepareEventsContext, 
  prepareTasksContext, 
  prepareContactsContext, 
  prepareDocumentsContext 
} from "@/utils/chat";

/**
 * Hook to fetch and prepare all relevant context data for the AI chat assistant
 */
export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      console.log('Fetching comprehensive chat context data...');
      
      try {
        // Fetch events data
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*, menu_selections(*), tasks(*)')
          .is('deleted_at', null)
          .order('event_date', { ascending: true });

        if (eventsError) {
          console.error('Error fetching events for chat context:', eventsError);
          throw eventsError;
        }

        // Fetch contacts data with explicit selection
        const { data: contacts, error: contactsError } = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false });

        if (contactsError) {
          console.error('Error fetching contacts for chat context:', contactsError);
          throw contactsError;
        }

        // Fetch documents data
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });

        if (docsError) {
          console.error('Error fetching documents for chat context:', docsError);
          throw docsError;
        }

        // Fetch tasks data
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('due_date', { ascending: true });

        if (tasksError) {
          console.error('Error fetching tasks for chat context:', tasksError);
          throw tasksError;
        }

        // Prepare formatted context strings for better AI context
        const eventsContext = prepareEventsContext(events || []);
        const contactsContext = prepareContactsContext(contacts || []);
        const documentsContext = prepareDocumentsContext(documents || []);
        const tasksContext = prepareTasksContext(tasks || []);
        
        console.log(`Chat context data loaded: ${events?.length || 0} events, ${contacts?.length || 0} contacts, ${documents?.length || 0} documents, ${tasks?.length || 0} tasks`);
        
        // Return both raw data for frontend use and formatted context for AI
        return {
          events: events || [],
          contacts: contacts || [],
          documents: documents || [],
          tasks: tasks || [],
          eventsContext,
          contactsContext,
          documentsContext,
          tasksContext
        };
      } catch (error) {
        console.error('Error fetching chat context data:', error);
        throw error;
      }
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 3
  });
};

/**
 * Hook to fetch context for a specific event
 */
export const useEventContext = (eventCode: string | null) => {
  return useQuery({
    queryKey: ['event-context', eventCode],
    queryFn: async () => {
      if (!eventCode) {
        return null;
      }
      
      try {
        const { data: event, error } = await supabase
          .from('events')
          .select('*, menu_selections(*), tasks(*)')
          .eq('event_code', eventCode)
          .is('deleted_at', null)
          .single();

        if (error) {
          console.error(`Error fetching event ${eventCode}:`, error);
          return null;
        }

        return event;
      } catch (error) {
        console.error(`Error in getEventContextData for ${eventCode}:`, error);
        return null;
      }
    },
    enabled: !!eventCode,
    staleTime: 30000,
    retry: 2
  });
};
