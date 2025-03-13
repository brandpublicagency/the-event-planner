import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { withTimeout } from '../timeoutUtils.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  // Add reasonable timeouts to avoid hanging requests
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10 second timeout for all requests
      });
    }
  }
});

/**
 * Checks if the database connection is working
 * 
 * @returns True if connected, false otherwise
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  console.log('Checking database connection...');
  
  try {
    // Use a simple, lightweight query to check connectivity
    const { data, error } = await withTimeout(
      supabase.from('events').select('count').limit(1).single(),
      'connection_check',
      5000 // Short timeout for connection check
    );
    
    if (error) {
      console.error('Database connection check failed:', error.message);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection check error:', error.message);
    return false;
  }
};

/**
 * Performs a more comprehensive verification of all required tables
 * 
 * @returns Object indicating success status and any problematic tables
 */
export const verifyAllRequiredTables = async (): Promise<{success: boolean, errorTables: string[]}> => {
  console.log('Verifying access to required tables...');
  const requiredTables = ['events', 'tasks', 'menu_selections', 'contacts', 'documents'];
  const errorTables: string[] = [];
  
  // Check each table in parallel for efficiency
  const results = await Promise.allSettled(
    requiredTables.map(table => 
      withTimeout(
        supabase.from(table).select('count').limit(1).single(),
        `verify_${table}`,
        3000
      )
    )
  );
  
  // Process results
  results.forEach((result, index) => {
    const tableName = requiredTables[index];
    if (result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error)) {
      console.error(`Error verifying table ${tableName}:`, 
        result.status === 'rejected' ? result.reason : result.value.error);
      errorTables.push(tableName);
    }
  });
  
  const success = errorTables.length === 0;
  console.log(`Table verification ${success ? 'successful' : 'failed'}`);
  
  if (errorTables.length > 0) {
    console.error('Problem tables:', errorTables);
  }
  
  return { success, errorTables };
};