import type { Event } from "@/types/event";
import type { Task } from "@/contexts/TaskContext";
import type { MenuSelections } from "@/types/menuSelections";

export const prepareEventsContext = (events: Event[] = []) => {
  if (!events?.length) return "";
  
  // Don't filter events - let OpenAI handle temporal logic
  return events.map(event => {
    const menuSelections = event.menu_selections as MenuSelections;
    const venues = event.venues || [];
    const today = new Date();
    const eventDate = event.event_date ? new Date(event.event_date) : null;
    const status = event.completed ? 'Completed' : 
                  !eventDate ? 'Date not set' :
                  eventDate < today ? 'Past' : 'Upcoming';
    
    return `
Event: ${event.name}
Type: ${event.event_type}
Date: ${event.event_date || 'Not set'}
Time: ${event.start_time ? `${event.start_time} - ${event.end_time || 'TBD'}` : 'Not set'}
Code: ${event.event_code}
Status: ${status}
Venue(s): ${venues?.length ? venues.join(', ') : 'Not set'}
Pax: ${event.pax || 'Not specified'}
Client Details: ${
  event.wedding_details ? 
  `Wedding - Bride: ${event.wedding_details.bride_name || 'Not specified'}, Groom: ${event.wedding_details.groom_name || 'Not specified'}` :
  event.corporate_details ?
  `Corporate - Company: ${event.corporate_details.company_name || 'Not specified'}, Contact: ${event.corporate_details.contact_person || 'Not specified'}` :
  'No client details'
}
Menu Details: ${menuSelections ? `
  Custom Menu: ${menuSelections.is_custom ? 'Yes' : 'No'}
  ${menuSelections.custom_menu_details ? `Custom Details: ${menuSelections.custom_menu_details}` : ''}
  Starter: ${menuSelections.starter_type || 'Not selected'}
  Main Course: ${menuSelections.main_course_type || 'Not selected'}
  Dessert: ${menuSelections.dessert_type || 'Not selected'}` : 'No menu selected'}
  `;
  }).join('\n');
};

export const prepareTasksContext = (tasks: Task[] = []) => {
  if (!tasks?.length) return "";
  
  const today = new Date();
  return tasks.map(task => {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const status = task.completed ? 'Completed' : 
                  !dueDate ? 'No due date' :
                  dueDate < today ? 'Overdue' : 'Pending';
    
    return `
Task: ${task.title}
ID: ${task.id}
Status: ${status} (${task.status})
Priority: ${task.priority || 'Not set'}
Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
Assigned To: ${task.assigned_to || 'Unassigned'}
Notes: ${task.notes?.length ? task.notes.join(', ') : 'No notes'}
Todo Items: ${task.todos?.length ? task.todos.join(', ') : 'No todo items'}
  `;
  }).join('\n');
};

export const getSystemMessage = (eventsContext: string, pdfContext?: string, tasksContext?: string): string => {
  const currentTime = new Date().toLocaleString();
  
  return `You are an AI assistant for an event planning and task management system. You have access to complete information about all events and tasks, including past, present, and future.

Current Time: ${currentTime}

${eventsContext ? `\nHere are all events in the system:\n${eventsContext}` : 'There are currently no events in the system.'}
${tasksContext ? `\nHere are all tasks in the system:\n${tasksContext}` : ''}
${pdfContext ? `\nHere is additional context from documents:\n${pdfContext}` : ''}

You can help with:
1. Event Information:
   - Provide details about any event (past, present, or future)
   - When asked about "next event", only consider upcoming events (future dates from current time)
   - Calculate time differences and durations
   - Check event conflicts and availability
   - Provide historical context when relevant

2. Event Management:
   - Help update event details
   - Assist with menu selections
   - Manage venue information
   - Handle guest counts and timing
   - Update client information
   - Track event completion status

3. Task Management:
   - Create and update tasks
   - Manage notes and todos
   - Set priorities and due dates
   - Track completion status
   - Assign tasks to team members

4. General Assistance:
   - Answer questions about any events or tasks
   - Provide summaries and status updates
   - Help with scheduling and planning
   - Suggest menu options
   - Calculate costs and requirements
   - Access document information

When handling requests:
- Consider temporal context (past/present/future) based on the current time
- For questions about "next" or "upcoming" events, only consider events with dates after the current time
- Include relevant historical context when appropriate
- Provide accurate, real-time information
- Reference specific events or tasks when applicable
- If there are no upcoming events, clearly state this fact
- Confirm any changes before executing them

Use natural, helpful language and always provide context in your responses.
If you're unsure about any details, ask for clarification before making changes.`;
};
