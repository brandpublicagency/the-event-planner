
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches comprehensive data from various tables to provide context for chat AI
 * @returns An object containing events, contacts, documents and tasks
 */
export const getChatContextData = async () => {
  console.log('Fetching chat context data...');
  
  try {
    // Fetch events with a simpler query structure
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
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

    // Fetch documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (docsError) {
      console.error('Error fetching documents for chat context:', docsError);
      throw docsError;
    }

    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (tasksError) {
      console.error('Error fetching tasks for chat context:', tasksError);
      throw tasksError;
    }

    console.log(`Chat context loaded: ${events?.length || 0} events, ${contacts?.length || 0} contacts, ${documents?.length || 0} documents, ${tasks?.length || 0} tasks`);
    
    return {
      events: events || [],
      contacts: contacts || [],
      documents: documents || [],
      tasks: tasks || []
    };
  } catch (error) {
    console.error('Error in getChatContextData:', error);
    throw error;
  }
};

/**
 * Fetches context data for a specific event
 * @param eventCode The event code to fetch context for
 */
export const getEventContextData = async (eventCode: string) => {
  if (!eventCode) {
    console.error('No event code provided');
    return null;
  }

  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
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
};
