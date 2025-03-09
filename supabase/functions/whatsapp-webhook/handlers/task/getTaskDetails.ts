
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatTaskDetails } from '../../formatters/taskFormatter.ts';
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getTaskDetails = async (taskId: string): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching task details for:', taskId);
    
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }

    if (!task) {
      return {
        type: 'text',
        message: "Task not found."
      };
    }

    return {
      type: 'text',
      message: formatTaskDetails(task)
    };
  } catch (error) {
    console.error('Error in getTaskDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching task details. Please try again later."
    };
  }
};
