
import { supabase } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

/**
 * Check database connection by performing a simple query
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    
    const { data, error } = await withTimeout(
      supabase.from('events').select('count(*)', { count: 'exact', head: true }),
      'connectionCheck',
      5000
    );
    
    if (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Error checking database connection:', error);
    return false;
  }
};

/**
 * Verify that all required tables exist in the database
 */
export const verifyAllRequiredTables = async (): Promise<{[key: string]: boolean}> => {
  try {
    console.log('Verifying required tables...');
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
