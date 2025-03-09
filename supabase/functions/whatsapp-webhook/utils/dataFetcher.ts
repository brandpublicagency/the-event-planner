
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from './timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle database errors consistently
const handleDbError = (operation: string, error: any) => {
  console.error(`Error in ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  throw error;
};

export const fetchEvents = async () => {
  console.log('Fetching events data from database');
  
  try {
    // Use withTimeout to ensure the query doesn't hang indefinitely
    const { data: events, error } = await withTimeout(
      supabase
        .from('events')
        .select(`
          *,
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true }),
      'fetchEvents',
      10000
    );

    if (error) {
      handleDbError('fetchEvents', error);
    }

    console.log(`Successfully fetched ${events?.length || 0} events`);
    return events || [];
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    return [];
  }
};

export const fetchContacts = async () => {
  console.log('Fetching contacts data');
  
  try {
    const { data: contacts, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*'),
      'fetchContacts',
      10000
    );
    
    if (error) {
      handleDbError('fetchContacts', error);
    }
    
    console.log(`Successfully fetched ${contacts?.length || 0} contacts`);
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
      supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null),
      'fetchDocuments',
      10000
    );
    
    if (error) {
      handleDbError('fetchDocuments', error);
    }
    
    console.log(`Successfully fetched ${documents?.length || 0} documents`);
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
      supabase
        .from('tasks')
        .select('*')
        .is('deleted_at', null)
        .order('due_date', { ascending: true }),
      'fetchTasks',
      10000
    );
    
    if (error) {
      handleDbError('fetchTasks', error);
    }
    
    console.log(`Successfully fetched ${tasks?.length || 0} tasks`);
    return tasks || [];
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return [];
  }
};

export const fetchEventById = async (eventCode: string) => {
  console.log(`Fetching event with code: ${eventCode}`);
  
  try {
    const { data: event, error } = await withTimeout(
      supabase
        .from('events')
        .select(`
          *,
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .eq('event_code', eventCode)
        .maybeSingle(),
      'fetchEventById',
      8000
    );

    if (error) {
      handleDbError(`fetchEventById for ${eventCode}`, error);
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
    const { data: task, error } = await withTimeout(
      supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .maybeSingle(),
      'fetchTaskById',
      8000
    );

    if (error) {
      handleDbError(`fetchTaskById for ${taskId}`, error);
    }

    return task;
  } catch (error) {
    console.error(`Error in fetchTaskById for ${taskId}:`, error);
    return null;
  }
};

// Add a function to check database connection
export const checkDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('events')
      .select('count')
      .limit(1)
      .single();
      
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log(`Database connection test successful (${duration}ms)`);
    return true;
  } catch (error) {
    console.error('Database connection test threw exception:', error);
    return false;
  }
};
