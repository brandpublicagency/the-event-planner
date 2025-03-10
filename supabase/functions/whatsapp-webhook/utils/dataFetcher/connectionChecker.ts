
import { supabase } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const checkDatabaseConnection = async (): Promise<boolean> => {
  console.log('Checking database connection...');
  
  try {
    // Use a simple query to check database connectivity
    const { data, error } = await withTimeout(
      supabase.from('events').select('event_code').limit(1),
      'checkDatabaseConnection',
      5000
    );
    
    if (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection check error:', error);
    return false;
  }
};

// Add a more comprehensive connection check that verifies access to all required tables
export const verifyAllRequiredTables = async (): Promise<{success: boolean, errorTables: string[]}> => {
  console.log('Verifying access to all required tables...');
  const tables = ['events', 'tasks', 'menu_selections', 'documents'];
  const errorTables: string[] = [];
  
  for (const table of tables) {
    try {
      const { error } = await withTimeout(
        supabase.from(table).select('id').limit(1),
        `verify_${table}`,
        3000
      );
      
      if (error) {
        console.error(`Error accessing table ${table}:`, error);
        errorTables.push(table);
      }
    } catch (error) {
      console.error(`Error in verification of table ${table}:`, error);
      errorTables.push(table);
    }
  }
  
  const success = errorTables.length === 0;
  console.log(`Table verification ${success ? 'successful' : 'failed'}, error tables:`, errorTables);
  
  return { success, errorTables };
};
