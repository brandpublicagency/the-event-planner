
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

export function prepareContactsContext(contacts: any[]) {
  if (!contacts || contacts.length === 0) {
    return "No contacts found.";
  }
  
  return contacts.map(contact => {
    return `Contact: ${JSON.stringify({
      id: contact.id,
      name: contact.full_name,
      email: contact.email,
      phone: contact.mobile,
      surname: contact.surname
    }, null, 2)}`;
  }).join('\n\n');
}

export function prepareDocumentsContext(documents: any[]) {
  if (!documents || documents.length === 0) {
    return "No documents found.";
  }
  
  return documents.map(doc => {
    return `Document: ${JSON.stringify({
      id: doc.id,
      title: doc.title,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      categories: doc.document_categories ? 
        doc.document_categories.map((cat: any) => cat.name).join(', ') : 
        'No categories'
    }, null, 2)}`;
  }).join('\n\n');
}

export function getSystemMessage(
  eventsContext: string, 
  contactsContext: string,
  documentsContext: string,
  pdfContent?: string, 
  tasksContext?: string
) {
  let systemMessage = `You are an AI assistant for Warm Karoo, an event planning company.

Current Date: ${new Date().toISOString().split('T')[0]}

Here is the context about the events:
${eventsContext}

Here is the context about contacts:
${contactsContext}

Here is the context about documents:
${documentsContext}`;

  if (tasksContext) {
    systemMessage += `\n\nHere is the context about tasks:
${tasksContext}`;
  }

  if (pdfContent) {
    systemMessage += `\n\nHere is additional information from documents:
${pdfContent}`;
  }

  systemMessage += `\n\nRespond in a helpful, friendly, and professional manner. For dates, use DD/MM/YYYY format. 
You have complete access to all system data including events, tasks, contacts, and documents.
You can help users find information, as well as suggest actions they can take like updating events, creating tasks, or sending messages.
You represent Warm Karoo, so maintain a professional tone at all times. If you don't know something, say so.`;

  return systemMessage;
}
