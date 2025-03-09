
import { getTaskDetails } from './getTaskDetails.ts';
import { getNextTask } from './getNextTask.ts';
import { getTodoList } from './getTodoList.ts';
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

// Re-export individual handlers for easier imports
export {
  getTaskDetails,
  getNextTask,
  getTodoList
};

// Export a function to fetch a task by ID for other handlers to use
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchTaskById = async (taskId: string): Promise<any> => {
  console.log(`Fetching task with ID: ${taskId}`);
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }

    return task;
  } catch (error) {
    console.error(`Error in fetchTaskById for ${taskId}:`, error);
    return null;
  }
};
