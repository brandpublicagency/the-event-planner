
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Standard error handler for database operations
export const handleDbError = (context: string, error: any) => {
  console.error(`Database error in ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  
  // Ensure we return a consistent error format
  return {
    error: true,
    context,
    message: error.message,
    code: error.code
  };
};

// Function to check if database connection is working
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    const startTime = Date.now();
    
    // Simple query to test connection
    const { error } = await supabase.from('events').select('event_code').limit(1);
    
    const elapsed = Date.now() - startTime;
    
    if (error) {
      console.error('Database connection check failed:', {
        error: error.message,
        code: error.code,
        elapsed
      });
      return false;
    }
    
    console.log(`Database connection successful (${elapsed}ms)`);
    return true;
  } catch (err) {
    console.error('Database connection check error:', err);
    return false;
  }
};

// Verify all required tables exist in the database
export const verifyAllRequiredTables = async (): Promise<{success: boolean, errorTables: string[]}> => {
  const requiredTables = ['events', 'tasks', 'profiles', 'documents', 'menu_selections'];
  const errorTables: string[] = [];
  
  try {
    console.log('Verifying required tables...');
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1).single();
        
        if (error) {
          console.error(`Table verification failed for ${table}:`, {
            error: error.message,
            code: error.code
          });
          errorTables.push(table);
        }
      } catch (tableError) {
        console.error(`Error checking table ${table}:`, tableError);
        errorTables.push(table);
      }
    }
    
    if (errorTables.length === 0) {
      console.log('All required tables verified successfully');
      return { success: true, errorTables: [] };
    } else {
      console.error('Some tables failed verification:', errorTables);
      return { success: false, errorTables };
    }
  } catch (err) {
    console.error('Table verification error:', err);
    return { success: false, errorTables: requiredTables };
  }
};
