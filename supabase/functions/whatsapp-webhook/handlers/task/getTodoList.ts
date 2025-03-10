
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getTodoList = async (): Promise<WhatsAppResponse> => {
  console.log('Fetching todo list');
  
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "You have no pending tasks. Great job!"
      };
    }

    // Group tasks by status
    const groupedTasks: Record<string, any[]> = {};
    tasks.forEach(task => {
      const status = task.status || 'pending';
      if (!groupedTasks[status]) {
        groupedTasks[status] = [];
      }
      groupedTasks[status].push(task);
    });

    // Create sections for the interactive list
    const sections = Object.entries(groupedTasks).map(([status, statusTasks]) => {
      const title = status.charAt(0).toUpperCase() + status.slice(1);
      
      return {
        title: `${title} Tasks`,
        rows: statusTasks.map(task => {
          const dueDate = task.due_date 
            ? format(new Date(task.due_date), 'dd MMM yyyy')
            : 'No due date';
            
          return {
            id: `task_${task.id}`,
            title: task.title,
            description: `Due: ${dueDate} | ${task.priority || 'Medium'} priority`
          };
        })
      };
    });

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Your To-Do List'
        },
        body: {
          text: `You have ${tasks.length} pending task${tasks.length > 1 ? 's' : ''}.`
        },
        action: {
          button: 'View Tasks',
          sections
        }
      }
    };
  } catch (error) {
    console.error('Error in getTodoList:', error);
    return {
      type: 'text',
      message: "I encountered an error while retrieving your tasks. Please try again later."
    };
  }
};
