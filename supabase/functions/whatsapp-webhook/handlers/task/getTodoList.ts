
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { handleError } from '../../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  // Add timeouts to avoid hanging requests
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(12000) // 12 second timeout
      });
    }
  }
});

/**
 * Retrieves a list of pending tasks for WhatsApp display
 */
export const getTodoList = async (): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching todo list');
    
    // First try a simpler query to test connection
    const connectionTest = await supabase.from('tasks').select('count', { count: 'exact', head: true });
    
    if (connectionTest.error) {
      console.error('Connection test error:', connectionTest.error);
      return {
        type: 'text',
        message: "I'm having trouble connecting to the tasks database. Please try again in a moment."
      };
    }
    
    console.log('Connection test passed, fetching tasks...');
    
    // Use a simplified query with a reasonable timeout
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('id, title, due_date, priority, status')
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error fetching tasks:', error);
      return handleError(error, 'getTodoList');
    }

    // Handle empty list gracefully
    if (!tasks?.length) {
      return {
        type: 'text',
        message: "You have no pending tasks. Great job!"
      };
    }

    console.log(`Found ${tasks.length} pending tasks`);
    
    try {
      // Group tasks by status
      const statusGroups = groupTasksByStatus(tasks);
      
      // Create sections for the interactive list
      const sections = createTaskSections(statusGroups);
      
      // Handle the case where we couldn't create valid sections
      if (sections.length === 0) {
        return createFallbackTextResponse(tasks);
      }

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
    } catch (formatError) {
      console.error('Error formatting tasks for WhatsApp:', formatError);
      // Fall back to simple text response
      return createFallbackTextResponse(tasks);
    }
  } catch (error) {
    console.error('Error in getTodoList:', error);
    return handleError(error, 'getTodoList');
  }
};

/**
 * Groups tasks by their status
 */
function groupTasksByStatus(tasks: any[]): Record<string, any[]> {
  const statusGroups: Record<string, any[]> = {};
  
  // First process high priority tasks
  const highPriorityTasks = tasks.filter(task => 
    task.priority?.toLowerCase() === 'high');
  
  if (highPriorityTasks.length > 0) {
    statusGroups['High Priority'] = highPriorityTasks;
  }
  
  // Group remaining tasks by status
  tasks.forEach(task => {
    // Skip high priority tasks that we've already grouped
    if (task.priority?.toLowerCase() === 'high') return;
    
    // Use a sensible default status if missing
    const status = task.status?.trim() || 'Pending';
    
    // Create normalized status key (capitalized)
    const statusKey = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    if (!statusGroups[statusKey]) {
      statusGroups[statusKey] = [];
    }
    
    statusGroups[statusKey].push(task);
  });
  
  return statusGroups;
}

/**
 * Creates sections for the WhatsApp list
 */
function createTaskSections(statusGroups: Record<string, any[]>): any[] {
  return Object.entries(statusGroups)
    .filter(([_, tasks]) => tasks.length > 0)
    .map(([status, tasks]) => {
      // Get appropriate emoji for the status
      const emoji = getStatusEmoji(status);
      const title = `${emoji} ${status} Tasks`;
      
      return {
        title: title.substring(0, 24), // WhatsApp limit
        rows: tasks.map(task => {
          // Format due date
          const dueDate = task.due_date 
            ? format(new Date(task.due_date), 'dd MMM')
            : 'No date';
            
          // Prepare priority display
          const priorityDisplay = task.priority 
            ? ` | ${capitalizeFirstLetter(task.priority)}` 
            : '';
            
          return {
            id: `task_${task.id}`,
            title: task.title.substring(0, 24), // WhatsApp limit
            description: `Due: ${dueDate}${priorityDisplay}`.substring(0, 72) // WhatsApp limit
          };
        })
      };
    });
}

/**
 * Creates a fallback text response when the interactive message can't be created
 */
function createFallbackTextResponse(tasks: any[]): WhatsAppResponse {
  // Create a simple text-based list
  const tasksList = tasks.slice(0, 10).map(task => {
    const dueDate = task.due_date 
      ? format(new Date(task.due_date), 'dd MMM yyyy')
      : 'No due date';
    const priority = task.priority ? ` (${task.priority})` : '';
    
    return `• ${task.title} - ${task.status || 'Pending'}${priority}\n  Due: ${dueDate}`;
  }).join('\n\n');
  
  const message = `Your Tasks:\n\n${tasksList}` + 
    (tasks.length > 10 ? `\n\n...and ${tasks.length - 10} more tasks` : '');
  
  return {
    type: 'text',
    message
  };
}

/**
 * Returns an appropriate emoji for a task status
 */
function getStatusEmoji(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('high') || statusLower.includes('urgent')) {
    return '🔴';
  }
  if (statusLower.includes('progress') || statusLower.includes('start')) {
    return '🔄';
  }
  if (statusLower.includes('review') || statusLower.includes('check')) {
    return '👀';
  }
  if (statusLower.includes('pend') || statusLower.includes('wait')) {
    return '⏳';
  }
  if (statusLower.includes('block') || statusLower.includes('hold')) {
    return '🚧';
  }
  
  // Default
  return '📋';
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
