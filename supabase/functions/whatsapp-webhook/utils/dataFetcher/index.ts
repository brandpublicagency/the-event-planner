
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from '../timeoutUtils.ts';

// Create and export the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle database errors consistently
export const handleDbError = (operation: string, error: any) => {
  console.error(`Error in ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  throw error;
};

// Verify essential database tables exist and are accessible
export const verifyAllRequiredTables = async (): Promise<boolean> => {
  try {
    // Check access to events table
    const { error: eventsError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (eventsError) {
      console.error('Error verifying events table:', eventsError);
      return false;
    }
    
    // Check access to tasks table
    const { error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (tasksError) {
      console.error('Error verifying tasks table:', tasksError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in verifyAllRequiredTables:', error);
    return false;
  }
};

// Export functions from other modules
export { 
  fetchEvents, 
  fetchEventById 
} from './eventFetcher.ts';

export { 
  fetchTasks, 
  fetchTaskById 
} from './taskFetcher.ts';

export { 
  fetchContacts 
} from './contactFetcher.ts';

export { 
  fetchDocuments 
} from './documentFetcher.ts';

export { 
  checkDatabaseConnection 
} from './connectionChecker.ts';
