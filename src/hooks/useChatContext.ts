import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PdfProcessedContent } from "@/integrations/supabase/types/pdfContent";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      // Fetch all events with their complete details
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
          menu_selections (*)
        `)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Use the RPC function to get PDF content
      const { data: pdfContent, error: pdfError } = await supabase
        .rpc('get_pdf_content');

      if (pdfError) throw pdfError;

      return {
        events: events || [],
        pdfContent: pdfContent || []
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2 // Retry failed requests twice
  });
};