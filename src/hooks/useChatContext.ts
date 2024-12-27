import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      // Fetch ALL events with their complete details, only excluding hard-deleted ones
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          wedding_details (*),
          corporate_details (*),
          event_venues (
            venues (
              id,
              name
            )
          ),
          menu_selections (*),
          tasks (
            id,
            title,
            completed,
            due_date,
            priority,
            status
          )
        `)
        .is('deleted_at', null)  // Only exclude hard-deleted events
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

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
        pdfContent: pdfContent || [],
        tasks: tasks || []
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });
};