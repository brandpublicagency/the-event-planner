import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const formatTaskDetails = (task: any) => {
  const dueDate = task.due_date 
    ? format(new Date(task.due_date), 'dd MMMM yyyy')
    : 'No due date';

  const priority = task.priority || 'Not set';
  const status = task.status || 'Pending';
  const notes = task.notes?.length 
    ? `\n\nNotes:\n${task.notes.join('\n')}`
    : '';
  const todos = task.todos?.length 
    ? `\n\nTodo Items:\n${task.todos.map((todo: string) => `• ${todo}`).join('\n')}`
    : '';

  return `*Task Details:* ${task.title}

📋 Status: ${status.toUpperCase()}
⭐ Priority: ${priority}
📅 Due: ${dueDate}
🔍 Task ID: ${task.task_code || task.id}${notes}${todos}

Reply with:
• "complete" to mark as done
• "update" to modify details
• "delete" to remove task`;
};