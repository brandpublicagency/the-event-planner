import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      const today = new Date().toISOString();
      
      // Fetch upcoming events with all related details
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          wedding_details (*),
          corporate_details (*),
          event_venues (
            venues (name)
          ),
          menu_selections (*)
        `)
        .gte('event_date', today)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch processed PDF content
      const { data: pdfContent, error: pdfError } = await supabase
        .from('pdf_processed_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (pdfError) throw pdfError;

      return {
        events: events || [],
        pdfContent: pdfContent || []
      };
    }
  });
};