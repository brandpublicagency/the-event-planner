
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from '../timeoutUtils.ts';

// Create and export the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(20000) // 20 second timeout
      });
    }
  }
});

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
  checkDatabaseConnection,
  verifyAllRequiredTables,
  performHealthCheck 
} from './connectionChecker.ts';
