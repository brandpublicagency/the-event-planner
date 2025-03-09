
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getTodoList = async (): Promise<WhatsAppResponse> => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .is('completed', false)
      .order('due_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "No pending tasks found."
      };
    }

    const sections = tasks.map(task => ({
      id: `task_${task.id}`,
      title: task.title,
      description: `📅 Due: ${task.due_date ? format(new Date(task.due_date), 'dd MMM yyyy') : 'No due date'}\n⭐ Priority: ${task.priority || 'None'}\n📋 Status: ${task.status}`
    }));

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Your To-do List'
        },
        body: {
          text: `You have ${tasks.length} pending tasks:`
        },
        action: {
          button: 'View Tasks',
          sections: [{
            title: '📋 Tasks',
            rows: sections
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getTodoList:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching tasks. Please try again later."
    };
  }
};
