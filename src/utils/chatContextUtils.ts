import type { Event } from "@/types/event";
import type { Task } from "@/contexts/TaskContext";
import type { MenuSelections } from "@/types/menuSelections";

export const prepareEventsContext = (events: Event[] = []) => {
  if (!events?.length) return "";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  // Filter out deleted and past events
  const activeEvents = events.filter(event => {
    if (event.deleted_at) return false;
    if (!event.event_date) return true; // Keep events with no date set
    const eventDate = new Date(event.event_date);
    return eventDate >= today;
  });
  
  if (!activeEvents.length) return "No upcoming events found.";
  
  return activeEvents.map(event => {
    const menuSelections = event.menu_selections as MenuSelections;
    const venues = event.event_venues?.map((ev: any) => ev.venues?.name).filter(Boolean);
    
    return `
Event: ${event.name}
Type: ${event.event_type}
Date: ${event.event_date || 'Not set'}
Time: ${event.start_time ? `${event.start_time} - ${event.end_time || 'TBD'}` : 'Not set'}
Code: ${event.event_code}
Status: ${event.completed ? 'Completed' : 'Upcoming'}
Venue(s): ${venues?.length ? venues.join(', ') : 'Not set'}
Pax: ${event.pax || 'Not specified'}
Menu Details: ${menuSelections ? `
  Custom Menu: ${menuSelections.is_custom ? 'Yes' : 'No'}
  ${menuSelections.custom_menu_details ? `Custom Details: ${menuSelections.custom_menu_details}` : ''}
  Starter: ${menuSelections.starter_type || 'Not selected'}
  Main Course: ${menuSelections.main_course_type || 'Not selected'}
  Dessert: ${menuSelections.dessert_type || 'Not selected'}` : 'No menu selected'}
  `}).join('\n');
};

export const prepareTasksContext = (tasks: Task[] = []) => {
  if (!tasks?.length) return "";
  
  return tasks.map(task => `
Task: ${task.title}
ID: ${task.id}
Status: ${task.status} (${task.completed ? 'Completed' : 'Pending'})
Priority: ${task.priority || 'Not set'}
Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
Assigned To: ${task.assigned_to || 'Unassigned'}
Notes: ${task.notes?.length ? task.notes.join(', ') : 'No notes'}
Todo Items: ${task.todos?.length ? task.todos.join(', ') : 'No todo items'}
  `).join('\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string, tasksContext?: string): string => {
  const currentTime = new Date().toLocaleString();
  
  return `You are an AI assistant for an event planning and task management system. You have access to real-time information and can provide accurate, up-to-date responses.

Current Time: ${currentTime}

${eventsContext ? `\nHere are the current events:\n${eventsContext}` : ''}
${tasksContext ? `\nHere are the current tasks:\n${tasksContext}` : ''}
${pdfContext ? `\nHere is additional context from documents:\n${pdfContext}` : ''}

You can help with:
1. Real-time Information:
   - Provide current time and date information
   - Access and share details about events and tasks
   - Calculate time differences and durations
   - Check event conflicts and availability

2. Event Management:
   - Update any event details (dates, names, types, etc.)
   - Modify menu selections and preferences
   - Add or update venue information
   - Change guest counts and timing
   - Update client contact information
   - Mark events as completed

3. Task Management:
   - Create, update, and complete tasks
   - Add, modify, or remove notes from tasks
   - Manage todo lists within tasks
   - Set or update task priorities
   - Change due dates
   - Assign tasks to team members

4. General Assistance:
   - Answer questions about events and tasks
   - Provide summaries and status updates
   - Help with scheduling and planning
   - Offer menu suggestions
   - Calculate costs and requirements
   - Access and share information from uploaded documents

When handling requests:
- Always provide accurate, real-time information
- Include relevant context from the knowledge base
- Reference specific events or tasks when applicable
- Confirm any changes before executing them
- Provide clear, detailed responses

Use natural, helpful language and always provide context in your responses.
If you're unsure about any details, ask for clarification before making changes.`;
};