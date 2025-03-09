
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      // Fetch ALL events with their complete details
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          wedding_details (*),
          corporate_details (*),
          menu_selections (*)
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch contacts data
      const { data: contacts, error: contactsError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Fetch all documents metadata
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*, document_categories(*)')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (docsError) throw docsError;

      // Use the RPC function to get PDF content
      const { data: pdfContent, error: pdfError } = await supabase
        .rpc('get_pdf_content');

      if (pdfError) throw pdfError;

      // Fetch all tasks to provide complete context
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (tasksError) throw tasksError;

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
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 60 * 1000 // Refresh every 10 minutes
  });
};
