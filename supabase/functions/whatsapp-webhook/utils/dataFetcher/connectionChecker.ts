
import { supabase } from './index.ts';
import { withTimeout, withRetry } from '../timeoutUtils.ts';
import { handleError } from '../errorHandler.ts';

/**
 * Check database connection by performing multiple simple queries with retries
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection with multiple strategies...');
    
    // Try multiple strategies with retry mechanism for better reliability
    try {
      // Strategy 1: Try a simple count query first (fastest)
      return await withRetry(
        async () => {
          try {
            console.log('Strategy 1: Testing with count query');
            const { count, error } = await supabase
              .from('events')
              .select('*', { count: 'exact', head: true })
              .limit(1);
            
            if (error) {
              console.error('Count query failed:', error);
              throw error;
            }
            
            console.log('Database connection successful (count strategy)');
            return true;
          } catch (countError) {
            console.error('Count strategy failed:', countError);
            
            // Fall back to strategy 2: Simple existence check
            console.log('Strategy 2: Testing with simple existence check');
            const { data, error } = await supabase
              .from('events')
              .select('event_code')
              .limit(1);
            
            if (error) {
              console.error('Existence check failed:', error);
              throw error;
            }
            
            console.log('Database connection successful (existence strategy)');
            return true;
          }
        },
        'connectionCheck',
        3, // 3 retries
        500 // 500ms initial delay with exponential backoff
      );
    } catch (strategyError) {
      console.error('All database connection strategies failed:', {
        message: strategyError.message || 'Empty error message',
        name: strategyError.name,
        stack: strategyError.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      // Log Supabase URL (safely) for diagnostics
      const url = Deno.env.get('SUPABASE_URL');
      console.log('Attempted connection to:', url ? `${url.substring(0, 15)}...` : 'MISSING');
      
      return false;
    }
  } catch (error) {
    console.error('Critical error in database connection check:', {
      message: error.message || 'Empty error message',
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    return false;
  }
};

/**
 * Verify that all required tables exist in the database
 */
export const verifyAllRequiredTables = async (): Promise<{[key: string]: boolean}> => {
  try {
    console.log('Verifying required tables...');
    // Check core tables needed for the webhook functionality
    const requiredTables = ['events', 'tasks', 'profiles', 'event_venues', 'menu_selections'];
    const results: {[key: string]: boolean} = {};
    
    for (const table of requiredTables) {
      try {
        const { count, error } = await withTimeout(
          supabase.from(table).select('*', { count: 'exact', head: true }),
          `tableCheck_${table}`,
          3000
        );
        
        results[table] = !error;
        
        if (error) {
          console.error(`Table check failed for ${table}:`, {
            message: error.message || 'Empty error message',
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          console.log(`Table ${table} exists and is accessible`);
        }
      } catch (e) {
        results[table] = false;
        console.error(`Error verifying table ${table}:`, e);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error verifying tables:', error);
    return {};
  }
};

/**
 * Performs a comprehensive health check on the database
 * with detailed diagnostics
 */
export const performHealthCheck = async (): Promise<{
  connected: boolean;
  tables: {[key: string]: boolean};
  diagnostics: {[key: string]: any};
}> => {
  console.log('Performing comprehensive database health check...');
  const diagnostics: {[key: string]: any} = {};
  
  // Check basic connection
  const connected = await checkDatabaseConnection();
  diagnostics.connectionResult = connected;
  
  // Safely log credentials status
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  diagnostics.supabaseUrl = url ? 'CONFIGURED' : 'MISSING';
  diagnostics.supabaseKeyConfigured = key ? 'CONFIGURED' : 'MISSING';
  
  // If connected, verify tables
  let tables = {};
  if (connected) {
    tables = await verifyAllRequiredTables();
    diagnostics.tableResults = tables;
    
    // Try a simple data fetch to test read operations
    try {
      const { data, error } = await withTimeout(
        supabase.from('events').select('event_code, name').limit(1),
        'healthCheck_sampleData',
        5000
      );
      
      diagnostics.sampleDataFetch = {
        success: !error,
        hasData: data && data.length > 0,
        error: error ? error.message : null
      };
    } catch (e) {
      diagnostics.sampleDataFetch = {
        success: false,
        error: e.message || 'Unknown error during sample data fetch'
      };
    }
  }
  
  console.log('Health check results:', { connected, tableCount: Object.keys(tables).length, diagnostics });
  
  return {
    connected,
    tables,
    diagnostics
  };
};
