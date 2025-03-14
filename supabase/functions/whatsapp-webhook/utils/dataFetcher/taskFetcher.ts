
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchTasks = async () => {
  console.log('Fetching tasks data from database');
  
  try {
    const { data: tasks, error } = await withTimeout(
      supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true }),
      'fetchTasks',
      10000
    );
    
    if (error) {
      handleDbError('fetchTasks', error);
    }
    
    console.log(`Successfully fetched ${tasks?.length || 0} tasks`);
    return tasks || [];
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return [];
  }
};

export const fetchTaskById = async (taskId: string) => {
  console.log(`Fetching task with ID: ${taskId}`);
  
  try {
    const { data: task, error } = await withTimeout(
      supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .maybeSingle(),
      'fetchTaskById',
      8000
    );
    
    if (error) {
      handleDbError(`fetchTaskById for ${taskId}`, error);
    }
    
    return task;
  } catch (error) {
    console.error(`Error in fetchTaskById for ${taskId}:`, error);
    return null;
  }
};
