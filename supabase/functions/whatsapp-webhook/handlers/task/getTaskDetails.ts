
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getTaskDetails = async (taskId: string): Promise<WhatsAppResponse> => {
  console.log('Fetching task details for:', taskId);
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return {
        type: 'text',
        message: "Error fetching task details. Please try again later."
      };
    }

    const dueDate = task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date';
    const statusLabel = task.status ? task.status.toUpperCase() : 'PENDING';
    const priorityLabels: Record<string, string> = {
      'high': '⚠️ HIGH PRIORITY',
      'medium': '⚠ MEDIUM PRIORITY',
      'low': '✓ LOW PRIORITY'
    };
    const priorityLabel = priorityLabels[task.priority?.toLowerCase() || 'medium'] || '';

    return {
      type: 'text',
      message: `*Task: ${task.title}*
*Status:* ${statusLabel}
*Due:* ${dueDate}
${priorityLabel ? `*Priority:* ${priorityLabel}\n` : ''}
${task.description ? `*Description:*\n${task.description}` : 'No description provided'}`
    };
  } catch (error) {
    console.error('Error in getTaskDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching task details. Please try again later."
    };
  }
};
