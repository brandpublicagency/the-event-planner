
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from './timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchEvents = async () => {
  console.log('Fetching events data');
  
  try {
    // Use a simpler query to avoid relationship errors
    const { data: events, error } = await withTimeout(
      supabase
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: true }),
      'Events query'
    );

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    // Fetch menu selections separately to enrich the events
    const { data: menuSelections } = await supabase
      .from('menu_selections')
      .select('*');

    // Enrich events with menu data if available
    const enrichedEvents = events?.map(event => {
      const eventMenu = menuSelections?.find(ms => ms.event_code === event.event_code);
      return {
        ...event,
        menu_selections: eventMenu || null
      };
    });

    return enrichedEvents || [];
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    return [];
  }
};

export const fetchContacts = async () => {
  console.log('Fetching contacts data');
  
  try {
    const { data: contacts, error } = await withTimeout(
      supabase.from('profiles').select('*'),
      'Contacts query'
    );

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    return contacts || [];
  } catch (error) {
    console.error('Error in fetchContacts:', error);
    return [];
  }
};

export const fetchDocuments = async () => {
  console.log('Fetching documents data');
  
  try {
    const { data: documents, error } = await withTimeout(
      supabase.from('documents').select('*').is('deleted_at', null),
      'Documents query'
    );

    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }

    return documents || [];
  } catch (error) {
    console.error('Error in fetchDocuments:', error);
    return [];
  }
};

export const fetchTasks = async () => {
  console.log('Fetching tasks data');
  
  try {
    const { data: tasks, error } = await withTimeout(
      supabase.from('tasks').select('*'),
      'Tasks query'
    );

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return tasks || [];
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return [];
  }
};

export const fetchEventById = async (eventCode: string) => {
  console.log(`Fetching event with code: ${eventCode}`);
  
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_code', eventCode)
      .single();

    if (error) {
      console.error(`Error fetching event ${eventCode}:`, error);
      throw error;
    }

    // Fetch menu information separately
    const { data: menuData } = await supabase
      .from('menu_selections')
      .select('*')
      .eq('event_code', eventCode)
      .single();

    if (menuData) {
      return { ...event, menu_selections: menuData };
    }

    return event;
  } catch (error) {
    console.error(`Error in fetchEventById for ${eventCode}:`, error);
    return null;
  }
};

export const fetchTaskById = async (taskId: string) => {
  console.log(`Fetching task with ID: ${taskId}`);
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }

    return task;
  } catch (error) {
    console.error(`Error in fetchTaskById for ${taskId}:`, error);
    return null;
  }
};
