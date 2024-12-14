import type { Event } from "@/types/event";

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

export const prepareTasksContext = (tasks: any[] = []) => {
  if (!tasks?.length) return "";
  
  return tasks.map(task => `
Task: ${task.title}
Status: ${task.completed ? 'Completed' : 'Pending'}
Priority: ${task.priority || 'Not set'}
Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
  `).join('\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string, tasksContext?: string) => ({
  role: "system",
  content: `You are an AI assistant for an event planning and task management system. 
${eventsContext ? `\nHere are the current events:\n${eventsContext}` : ''}
${tasksContext ? `\nHere are the current tasks:\n${tasksContext}` : ''}
${pdfContext ? `\nHere is additional context from documents:\n${pdfContext}` : ''}

You can help with:
1. Event information and updates
2. Task management and updates
3. Answering questions about events and tasks
4. Providing summaries and status updates

When asked about tasks or to-do items:
- Check the tasks list and prioritize by due date and priority level
- For incomplete tasks, mention their status and due dates
- If there are no tasks, suggest creating new ones

Use natural, helpful language and always provide context in your responses.`
});