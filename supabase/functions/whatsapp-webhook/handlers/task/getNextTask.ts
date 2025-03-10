
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextTask = async (phoneNumber?: string): Promise<WhatsAppResponse> => {
  console.log('Fetching next task');
  
  try {
    const today = new Date();
    
    // Query to get the next pending task
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching next task:', error);
      throw error;
    }

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "You have no pending tasks. Great job!"
      };
    }

    const task = tasks[0];
    const dueDate = task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date';
    
    return {
      type: 'text',
      message: `*Your Next Task*

*${task.title}*
*Status:* ${task.status.toUpperCase()}
*Due:* ${dueDate}
${task.description ? `\n*Description:*\n${task.description}` : ''}`
    };
  } catch (error) {
    console.error('Error in getNextTask:', error);
    return {
      type: 'text',
      message: "I encountered an error while retrieving your next task. Please try again later."
    };
  }
};
