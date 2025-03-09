
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      console.log('Fetching comprehensive chat context data...');
      
      // Fetch ALL events with their complete details, ensuring we get upcoming events first
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          wedding_details (*),
          corporate_details (*),
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          ),
          tasks (*)
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events for chat context:', eventsError);
        throw eventsError;
      }

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
        .select('*, document_categories(*)')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents for chat context:', docsError);
        throw docsError;
      }

      // Use the RPC function to get PDF content
      const { data: pdfContent, error: pdfError } = await supabase
        .rpc('get_pdf_content');

      if (pdfError) {
        console.error('Error fetching PDF content for chat context:', pdfError);
        throw pdfError;
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

      console.log(`Chat context data fetched: ${events?.length || 0} events, ${contacts?.length || 0} contacts, ${documents?.length || 0} documents, ${tasks?.length || 0} tasks`);
      
      return {
        events: events || [],
        contacts: contacts || [],
        documents: documents || [],
        pdfContent: pdfContent || [],
        tasks: tasks || []
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000 // Refresh every 10 minutes
  });
};
