import type { Event } from "@/types/event";
import type { Task } from "@/contexts/TaskContext";

export const prepareEventsContext = (events: Event[] = []) => {
  if (!events?.length) return "";
  
  return events.map(event => `
Event: ${event.name}
Type: ${event.event_type}
Date: ${event.event_date || 'Not set'}
Code: ${event.event_code}
Status: ${event.completed ? 'Completed' : 'Upcoming'}
Menu Details: ${event.menu_selections ? `Custom Menu: ${event.menu_selections.is_custom ? 'Yes' : 'No'}
${event.menu_selections.custom_menu_details ? `Custom Details: ${event.menu_selections.custom_menu_details}` : ''}
Starter: ${event.menu_selections.starter_type || 'Not selected'}
Main Course: ${event.menu_selections.main_course_type || 'Not selected'}
Dessert: ${event.menu_selections.dessert_type || 'Not selected'}` : 'No menu selected'}
  `).join('\n');
};

export const prepareTasksContext = (tasks: Task[] = []) => {
  if (!tasks?.length) return "";
  
  return tasks.map(task => `
Task: ${task.title}
ID: ${task.id}
Status: ${task.completed ? 'Completed' : 'Pending'}
Priority: ${task.priority || 'Not set'}
Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
Notes: ${task.notes?.length ? task.notes.join(', ') : 'No notes'}
Todo Items: ${task.todos?.length ? task.todos.join(', ') : 'No todo items'}
  `).join('\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string, tasksContext?: string): string => {
  return `You are an AI assistant for an event planning and task management system. 
${eventsContext ? `\nHere are the current events:\n${eventsContext}` : ''}
${tasksContext ? `\nHere are the current tasks:\n${tasksContext}` : ''}
${pdfContext ? `\nHere is additional context from documents:\n${pdfContext}` : ''}

You can help with:
1. Event Management:
   - Update any event details (dates, names, types, etc.)
   - Modify menu selections and preferences
   - Add or update venue information
   - Change guest counts and timing
   - Update client contact information
   - Mark events as completed

2. Task Management:
   - Create, update, and complete tasks
   - Add, modify, or remove notes from tasks
   - Manage todo lists within tasks
   - Set or update task priorities
   - Change due dates
   - Assign tasks to team members

3. General Assistance:
   - Answer questions about events and tasks
   - Provide summaries and status updates
   - Help with scheduling and planning
   - Offer menu suggestions
   - Calculate costs and requirements

When handling event-related requests:
- Always confirm the event code before making changes
- For dates, use the format YYYY-MM-DD
- Provide clear confirmation messages after updates
- Ensure menu selections match available options
- Validate guest counts and venue capacity

When managing tasks:
- Check the tasks list and prioritize by due date and priority level
- For incomplete tasks, mention their status and due dates
- Maintain the existing structure of todo lists
- Preserve task history and notes
- Ensure proper task assignment

Use natural, helpful language and always provide context in your responses.
If you're unsure about any details, ask for clarification before making changes.`;
};