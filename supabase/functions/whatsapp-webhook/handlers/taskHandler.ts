import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextTask = async (userId: string) => {
  try {
    console.log('Fetching next task for user:', userId);
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`user_id.eq.${userId},assigned_to.eq.${userId}`)
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "No pending tasks found."
      };
    }

    const task = tasks[0];
    const dueDate = task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date';

    const message = `The next task on your to-do list is "${task.title}". Here are the details:

- ID: ${task.id}
- Status: ${task.status === 'todo' ? 'Pending (todo)' : task.status}
- Priority: ${task.priority || 'Not set'}
- Due Date: ${dueDate}
- Assigned To: ${task.assigned_to ? 'Assigned' : 'Unassigned'}

Please note that ${task.todos?.length ? `there are ${task.todos.length} todo items` : 'there are no specific todo items'} ${task.notes?.length ? `and ${task.notes.length} notes` : 'and no notes'} associated with this task${task.todos?.length || task.notes?.length ? '.' : ' at the moment.'} If you need to update anything or require further information, feel free to ask.`;

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getNextTask:', error);
    return {
      type: 'text',
      message: "I encountered an error fetching your next task. Please try again later."
    };
  }
};