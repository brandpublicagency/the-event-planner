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
  `).join('\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string, tasksContext?: string): string => {
  return `You are an AI assistant for an event planning and task management system. 
${eventsContext ? `\nHere are the current events:\n${eventsContext}` : ''}
${tasksContext ? `\nHere are the current tasks:\n${tasksContext}` : ''}
${pdfContext ? `\nHere is additional context from documents:\n${pdfContext}` : ''}

You can help with:
1. Event information and updates (including date changes)
2. Task management and updates (including adding notes to tasks)
3. Answering questions about events and tasks
4. Providing summaries and status updates

When handling event-related requests:
- You can update event dates and other details
- Always confirm the event code before making changes
- For date changes, use the format YYYY-MM-DD
- Provide clear confirmation messages after updates

When asked about tasks or to-do items:
- Check the tasks list and prioritize by due date and priority level
- For incomplete tasks, mention their status and due dates
- You can add notes to existing tasks or create new tasks
- If there are no tasks, suggest creating new ones

When adding notes to tasks:
- Confirm the task ID before adding notes
- Provide clear confirmation when notes are added
- Suggest related actions when appropriate

Use natural, helpful language and always provide context in your responses.`;
};