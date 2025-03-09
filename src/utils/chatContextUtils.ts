import { Event } from "@/types/event";
import { Task } from "@/contexts/task/taskTypes";

export function formatEventForContext(event: Event) {
  const formattedEvent = {
    event_code: event.event_code,
    name: event.name,
    event_type: event.event_type,
    date: event.event_date,
    time: event.start_time ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}` : null,
    pax: event.pax,
    venue: event.venues?.join(', '),
    description: event.description,
    status: event.completed ? 'Completed' : 'Upcoming',
  };

  // Add contact information based on event type
  let contactInfo = {};
  
  if (event.event_type === 'Wedding') {
    contactInfo = {
      bride: event.primary_name,
      bride_email: event.primary_email,
      bride_phone: event.primary_phone,
      groom: event.secondary_name,
      groom_email: event.secondary_email,
      groom_phone: event.secondary_phone,
    };
  } else {
    contactInfo = {
      company: event.company,
      vat_number: event.vat_number,
      contact_person: event.primary_name,
      contact_email: event.primary_email,
      contact_phone: event.primary_phone,
    };
  }

  // Add address
  const addressInfo = {
    address: event.address,
  };

  return {
    ...formattedEvent,
    ...contactInfo,
    ...addressInfo
  };
}

export function prepareEventsContext(events: Event[]) {
  if (!events || events.length === 0) {
    return "No events found.";
  }
  
  return events.map(event => {
    const formattedEvent = formatEventForContext(event);
    return `Event: ${JSON.stringify(formattedEvent, null, 2)}`;
  }).join('\n\n');
}

export function prepareTasksContext(tasks: Task[]) {
  if (!tasks || tasks.length === 0) {
    return "No tasks found.";
  }
  
  return tasks.map(task => {
    return `Task: ${JSON.stringify({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      completed: task.completed,
      assigned_to: task.assigned_to,
      notes: task.notes,
      todos: task.todos
    }, null, 2)}`;
  }).join('\n\n');
}

export function getSystemMessage(eventsContext: string, pdfContent?: string, tasksContext?: string) {
  let systemMessage = `You are an AI assistant for an event planning company.

Current Date: ${new Date().toISOString().split('T')[0]}

Here is the context about the events:
${eventsContext}`;

  if (tasksContext) {
    systemMessage += `\n\nHere is the context about tasks:
${tasksContext}`;
  }

  if (pdfContent) {
    systemMessage += `\n\nHere is additional information from documents:
${pdfContent}`;
  }

  systemMessage += `\n\nRespond in a helpful, friendly, and professional manner. For dates, use DD/MM/YYYY format. If you don't know something, say so.`;

  return systemMessage;
}
