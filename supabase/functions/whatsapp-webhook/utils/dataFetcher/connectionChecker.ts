
import { supabase } from './index.ts';
import { withTimeout, withRetry } from '../timeoutUtils.ts';
import { handleError } from '../errorHandler.ts';

/**
 * Check database connection by performing a simple query
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    
    // Try multiple connection strategies with retry mechanism for better reliability
    try {
      // Use withRetry to attempt the connection multiple times
      return await withRetry(
        async () => {
          // Strategy 1: Simple existence check
          const { data, error } = await supabase.from('events').select('event_code').limit(1);
          
          if (error) {
            console.error('Database connection check failed with specific error:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
          
          console.log('Database connection successful', { dataFound: data && data.length > 0 });
          return true;
        },
        'connectionCheck_basic',
        3, // 3 retries
        500 // 500ms initial delay
      );
    } catch (strategyError) {
      console.error('All database connection check attempts failed:', {
        message: strategyError.message,
        name: strategyError.name,
        stack: strategyError.stack?.split('\n').slice(0, 3).join('\n') 
      });
      
      // Log Supabase URL (without credentials) for diagnostics
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'URL not found';
      console.log('Attempted connection to:', supabaseUrl);
      
      return false;
    }
  } catch (error) {
    console.error('Critical error checking database connection:', {
      message: error.message,
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
            message: error.message,
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
  diagnostics.supabaseUrl = Deno.env.get('SUPABASE_URL') ? 'CONFIGURED' : 'MISSING';
  diagnostics.supabaseKeyConfigured = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'CONFIGURED' : 'MISSING';
  
  // If connected, verify tables
  let tables = {};
  if (connected) {
    tables = await verifyAllRequiredTables();
    diagnostics.tableResults = tables;
    
    // Try a simple data fetch
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
        error: e.message
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
