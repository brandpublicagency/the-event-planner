
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

      // Now fetch wedding details separately and merge later
      const { data: weddingDetails, error: weddingError } = await supabase
        .from('wedding_details')
        .select('*');

      if (weddingError && weddingError.code !== 'PGRST116') {
        console.error('Error fetching wedding details:', weddingError);
      }

      // Fetch corporate details separately
      const { data: corporateDetails, error: corporateError } = await supabase
        .from('corporate_details')
        .select('*');

      if (corporateError && corporateError.code !== 'PGRST116') {
        console.error('Error fetching corporate details:', corporateError);
      }

      // Fetch menu selections separately
      const { data: menuSelections, error: menuError } = await supabase
        .from('menu_selections')
        .select('*');

      if (menuError && menuError.code !== 'PGRST116') {
        console.error('Error fetching menu selections:', menuError);
      }

      // Fetch event venues separately
      const { data: eventVenues, error: venuesError } = await supabase
        .from('event_venues')
        .select('*, venues(name)');

      if (venuesError && venuesError.code !== 'PGRST116') {
        console.error('Error fetching event venues:', venuesError);
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

      // Fetch all tasks to provide complete context
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (tasksError) {
        console.error('Error fetching tasks for chat context:', tasksError);
        throw tasksError;
      }

      // Try to get PDF content, but don't fail if it's not available
      let pdfContent = [];
      try {
        const { data: pdf, error: pdfError } = await supabase
          .rpc('get_pdf_content');

        if (!pdfError) {
          pdfContent = pdf || [];
        }
      } catch (error) {
        console.warn('PDF content not available:', error);
      }

      // Enrich events with related data
      const enrichedEvents = events?.map(event => {
        return {
          ...event,
          wedding_details: weddingDetails?.find(wd => wd.event_code === event.event_code) || null,
          corporate_details: corporateDetails?.find(cd => cd.event_code === event.event_code) || null,
          menu_selections: menuSelections?.find(ms => ms.event_code === event.event_code) || null,
          event_venues: eventVenues?.filter(ev => ev.event_code === event.event_code) || [],
          tasks: tasks?.filter(task => task.event_code === event.event_code) || []
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000 // Refresh every 10 minutes
  });
};
