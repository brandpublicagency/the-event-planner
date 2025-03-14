
import { supabase } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';
import { handleError } from '../errorHandler.ts';

/**
 * Check database connection by performing a simple query
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    
    // Try multiple connection strategies for better reliability
    try {
      // Strategy 1: Simple count query with short timeout
      const { data: countData, error: countError } = await withTimeout(
        supabase.from('events').select('count(*)', { count: 'exact', head: true }),
        'connectionCheck_count',
        3000
      );
      
      if (!countError) {
        console.log('Database connection successful via count query');
        return true;
      }
      
      console.warn('Count query failed, trying alternative connection test...');
      
      // Strategy 2: Select a single row with minimal columns
      const { data: rowData, error: rowError } = await withTimeout(
        supabase.from('events').select('event_code').limit(1),
        'connectionCheck_row',
        3000
      );
      
      if (!rowError) {
        console.log('Database connection successful via row query');
        return true;
      }
      
      console.error('Database connection failed on all attempts:', { countError, rowError });
      return false;
    } catch (strategyError) {
      console.error('Error during connection check strategies:', strategyError);
      return false;
    }
  } catch (error) {
    console.error('Critical error checking database connection:', error);
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
          console.error(`Table check failed for ${table}:`, error);
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
