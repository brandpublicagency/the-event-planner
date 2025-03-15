
/**
 * Prepares tasks context for AI
 */
export const prepareTasksContext = (tasks: any[] = []): string => {
  if (!tasks || tasks.length === 0) {
    return 'No tasks found.';
  }
  
  // Sort tasks by due date (upcoming first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
  
  // Separate pending and completed tasks
  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);
  
  let tasksContext = `TASKS (${tasks.length} total):\n`;
  
  // Add pending tasks first
  if (pendingTasks.length > 0) {
    tasksContext += `\nPENDING TASKS (${pendingTasks.length}):\n`;
    pendingTasks.slice(0, 10).forEach((task, index) => {
      const dueDate = task.due_date 
        ? new Date(task.due_date).toLocaleDateString() 
        : 'No due date';
      
      tasksContext += `${index + 1}. ${task.title} - Due: ${dueDate}${task.event_code ? ` - Event: ${task.event_code}` : ''}\n`;
    });
    
    if (pendingTasks.length > 10) {
      tasksContext += `... and ${pendingTasks.length - 10} more pending tasks.\n`;
    }
  } else {
    tasksContext += "\nNo pending tasks found.\n";
  }
  
  // Add a brief summary of completed tasks
  if (completedTasks.length > 0) {
    tasksContext += `\nCOMPLETED TASKS: ${completedTasks.length} tasks have been completed.\n`;
  }
  
  return tasksContext;
};
