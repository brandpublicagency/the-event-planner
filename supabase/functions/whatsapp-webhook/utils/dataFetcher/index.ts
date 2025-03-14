
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout, withRetry } from '../timeoutUtils.ts';

// Create and export the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Missing required Supabase credentials', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseKey 
  });
  throw new Error('Missing Supabase credentials');
}

// Log Supabase connection details (safely)
console.log('Initializing Supabase client with:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING',
  keyConfigured: !!supabaseKey
});

// Create Supabase client with improved settings
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'whatsapp-webhook-function'
    },
    fetch: (url, options) => {
      // Add timeout to all requests
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  }
});

// Helper function to handle database errors consistently
export const handleDbError = (operation: string, error: any) => {
  console.error(`Error in ${operation}:`, {
    message: error.message || 'Empty error message',
    details: error.details || 'No details',
    hint: error.hint,
    code: error.code,
    stack: error.stack?.split('\n').slice(0, 3).join('\n')
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
