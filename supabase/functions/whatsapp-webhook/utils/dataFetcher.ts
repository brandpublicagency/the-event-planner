
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from './timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchEvents = async () => {
  console.log('Fetching events data');
  
  const { data: events, error } = await withTimeout(
    supabase
      .from('events')
      .select(`
        *,
        wedding_details (*),
        corporate_details (*),
        menu_selections (*),
        event_venues (
          venues (
            name
          )
        ),
        tasks (
          id,
          title,
          completed,
          due_date,
          priority,
          status
        )
      `)
      .is('deleted_at', null)
      .order('event_date', { ascending: true }),
    'Events query'
  );

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return events || [];
};

export const fetchContacts = async () => {
  console.log('Fetching contacts data');
  
  const { data: contacts, error } = await withTimeout(
    supabase.from('profiles').select('*'),
    'Contacts query'
  );

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return contacts || [];
};

export const fetchDocuments = async () => {
  console.log('Fetching documents data');
  
  const { data: documents, error } = await withTimeout(
    supabase.from('documents').select('*, document_categories(*)').is('deleted_at', null),
    'Documents query'
  );

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return documents || [];
};

export const fetchTasks = async () => {
  console.log('Fetching tasks data');
  
  const { data: tasks, error } = await withTimeout(
    supabase.from('tasks').select('*'),
    'Tasks query'
  );

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return tasks || [];
};
