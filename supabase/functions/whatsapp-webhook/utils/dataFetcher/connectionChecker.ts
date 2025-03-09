
import { supabase } from './index.ts';

export const checkDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('events')
      .select('count')
      .limit(1)
      .single();
      
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log(`Database connection test successful (${duration}ms)`);
    return true;
  } catch (error) {
    console.error('Database connection test threw exception:', error);
    return false;
  }
};
