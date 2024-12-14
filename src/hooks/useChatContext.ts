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

      // Fetch processed PDF content using raw query
      const { data: pdfContent, error: pdfError } = await supabase
        .rpc('get_pdf_content') as { data: PdfProcessedContent[] | null, error: any };

      if (pdfError) throw pdfError;

      return {
        events: events || [],
        pdfContent: pdfContent || []
      };
    }
  });
};