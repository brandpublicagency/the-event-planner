import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextTask = async (userId: string) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`user_id.eq.${userId},assigned_to.eq.${userId}`)
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error("Error fetching tasks");
    }

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "No pending tasks found."
      };
    }

    const task = tasks[0];
    const dueDate = task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date';

    return {
      type: 'text',
      message: `Next task: "${task.title}"\nPriority: ${task.priority || 'Not set'}\nDue: ${dueDate}\nStatus: ${task.status}`
    };
  } catch (error) {
    console.error('Error in getNextTask:', error);
    throw error;
  }
};