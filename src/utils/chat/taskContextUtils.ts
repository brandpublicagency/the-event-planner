
import { Task } from "@/contexts/task/taskTypes";
import { format } from "date-fns";

/**
 * Prepares tasks context data for the AI assistant
 */
export function prepareTasksContext(tasks: Task[]) {
  if (!tasks || tasks.length === 0) {
    return "No tasks found.";
  }
  
  // Split into upcoming, today, and overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate < today && !task.completed;
  });
  
  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate < tomorrow && !task.completed;
  });
  
  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= tomorrow && !task.completed;
  });
  
  let tasksContext = '';
  
  // Format overdue tasks
  if (overdueTasks.length > 0) {
    tasksContext += "OVERDUE TASKS:\n";
    tasksContext += overdueTasks.map(task => {
      return `Task: ${JSON.stringify({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority || 'None',
        due_date: task.due_date ? format(new Date(task.due_date), 'dd/MM/yyyy') : 'No due date',
        completed: task.completed,
        assigned_to: task.assigned_to || 'Unassigned',
        notes: task.notes || [],
        todos: task.todos || []
      }, null, 2)}`;
    }).join('\n\n');
  }
  
  // Format today's tasks
  if (todayTasks.length > 0) {
    if (tasksContext) tasksContext += '\n\n';
    tasksContext += "TODAY'S TASKS:\n";
    tasksContext += todayTasks.map(task => {
      return `Task: ${JSON.stringify({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority || 'None',
        due_date: task.due_date ? format(new Date(task.due_date), 'dd/MM/yyyy') : 'No due date',
        completed: task.completed,
        assigned_to: task.assigned_to || 'Unassigned',
        notes: task.notes || [],
        todos: task.todos || []
      }, null, 2)}`;
    }).join('\n\n');
  }
  
  // Format upcoming tasks
  if (upcomingTasks.length > 0) {
    if (tasksContext) tasksContext += '\n\n';
    tasksContext += "UPCOMING TASKS:\n";
    tasksContext += upcomingTasks.map(task => {
      return `Task: ${JSON.stringify({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority || 'None',
        due_date: task.due_date ? format(new Date(task.due_date), 'dd/MM/yyyy') : 'No due date',
        completed: task.completed,
        assigned_to: task.assigned_to || 'Unassigned',
        notes: task.notes || [],
        todos: task.todos || []
      }, null, 2)}`;
    }).join('\n\n');
  }
  
  if (!tasksContext) {
    tasksContext = "No active tasks found.";
  }
  
  return tasksContext;
}
