
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
