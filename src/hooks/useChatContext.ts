import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatContext = () => {
  return useQuery({
    queryKey: ['chat-context'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

      // Fetch all events with their complete details, excluding deleted ones and past events
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
        .is('deleted_at', null)  // Explicitly filter out deleted events
        .gte('event_date', today.toISOString()) // Only get future events
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
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchInterval: false // Disable automatic refetching
  });
};