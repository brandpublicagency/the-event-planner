
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      console.log('Fetching comprehensive chat context data...');
      
      // Fetch events with a simpler query structure to avoid relationship errors
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events for chat context:', eventsError);
        throw eventsError;
      }

      // Fetch venues separately instead of through relations
      const venuesMap = {}; // Initialize an empty object for venue lookup
      
      // Fetch contacts data
      const { data: contacts, error: contactsError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts for chat context:', contactsError);
        throw contactsError;
      }

      // Fetch all documents metadata
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents for chat context:', docsError);
        throw docsError;
      }

      // Fetch all tasks to provide complete context
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (tasksError) {
        console.error('Error fetching tasks for chat context:', tasksError);
        throw tasksError;
      }

      // Fetch menu selections separately
      let menuSelections = [];
      try {
        const { data, error } = await supabase
          .from('menu_selections')
          .select('*');

        if (error) {
          console.log('Menu selections table may not exist yet or other error:', error);
        } else {
          menuSelections = data || [];
        }
      } catch (error) {
        console.log('Error fetching menu selections:', error);
        // Don't throw here, just continue with empty array
      }

      // Try to get PDF content, but don't fail if it's not available
      let pdfContent = [];
      try {
        const { data: pdf, error: pdfError } = await supabase
          .rpc('get_pdf_content');

        if (!pdfError) {
          pdfContent = pdf || [];
        } else {
          console.warn('PDF content unavailable:', pdfError);
        }
      } catch (error) {
        console.warn('PDF content not available:', error);
      }

      // Enrich events with related data
      const enrichedEvents = events?.map(event => {
        // Find related menu selection for this event
        const eventMenuSelection = menuSelections?.find(ms => 
          ms.event_code === event.event_code
        ) || null;
        
        // Find event related tasks
        const eventTasks = tasks?.filter(task => 
          task.task_code === event.event_code // Use task_code to match with event_code
        ) || [];
        
        return {
          ...event,
          menu_selections: eventMenuSelection,
          tasks: eventTasks
        };
      });
      
      console.log(`Chat context data fetched: ${enrichedEvents?.length || 0} events, ${contacts?.length || 0} contacts, ${documents?.length || 0} documents, ${tasks?.length || 0} tasks`);
      
      return {
        events: enrichedEvents || [],
        contacts: contacts || [],
        documents: documents || [],
        pdfContent: pdfContent || [],
        tasks: tasks || []
      };
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 3, // More retries for resilience
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });
};
