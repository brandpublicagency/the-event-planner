
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
export const verifyAllRequiredTables = async (): Promise<{ success: boolean, errorTables: string[] }> => {
  try {
    console.log('Verifying database tables...');
    const errorTables = [];
    
    // Check access to events table
    const { error: eventsError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (eventsError) {
      console.error('Error verifying events table:', eventsError);
      errorTables.push('events');
    }
    
    // Check access to tasks table
    const { error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (tasksError) {
      console.error('Error verifying tasks table:', tasksError);
      errorTables.push('tasks');
    }
    
    // Check access to menu_selections table
    const { error: menuError } = await supabase
      .from('menu_selections')
      .select('event_code')
      .limit(1);
    
    if (menuError) {
      console.error('Error verifying menu_selections table:', menuError);
      errorTables.push('menu_selections');
    }
    
    console.log(`Table verification complete. ${errorTables.length} tables with errors.`);
    return { 
      success: errorTables.length === 0,
      errorTables
    };
  } catch (error) {
    console.error('Error in verifyAllRequiredTables:', error);
    return { 
      success: false, 
      errorTables: ['unknown - general error']
    };
  }
};

// Check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    const start = Date.now();
    
    // Simple query to verify connection
    const { data, error } = await withTimeout(
      supabase.from('events').select('count(*)', { count: 'exact', head: true }),
      'database connection check',
      5000
    );
    
    const elapsed = Date.now() - start;
    
    if (error) {
      console.error(`Database connection check failed after ${elapsed}ms:`, error);
      return false;
    }
    
    console.log(`Database connection verified in ${elapsed}ms`);
    return true;
  } catch (error) {
    console.error('Database connection check failed with exception:', error);
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
