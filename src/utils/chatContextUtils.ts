import { Event } from "@/types/event";
import { Task } from "@/contexts/task/taskTypes";
import { format } from "date-fns";

export function formatEventForContext(event: Event) {
  // Extract venue information from event_venues if it exists
  const venues = event.venues ? event.venues.join(', ') : 
                (event.event_venues && Array.isArray(event.event_venues)) ? 
                  event.event_venues
                    .map((v) => v.venues?.name)
                    .filter(Boolean)
                    .join(', ') : 
                  'No venue specified';

  const formattedEvent = {
    event_code: event.event_code,
    name: event.name,
    event_type: event.event_type,
    date: event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Date not set',
    time: event.start_time ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}` : 'Time not set',
    pax: event.pax || 'Not specified',
    venue: venues,
    description: event.description || 'No description',
    status: event.completed ? 'Completed' : 'Upcoming',
  };

  // Add contact information based on event type
  let contactInfo = {};
  
  if (event.event_type === 'Wedding') {
    contactInfo = {
      bride: event.primary_name || 'Not specified',
      bride_email: event.primary_email || 'Not specified',
      bride_phone: event.primary_phone || 'Not specified',
      groom: event.secondary_name || 'Not specified',
      groom_email: event.secondary_email || 'Not specified',
      groom_phone: event.secondary_phone || 'Not specified',
    };
  } else {
    contactInfo = {
      company: event.company || 'Not specified',
      vat_number: event.vat_number || 'Not specified',
      contact_person: event.primary_name || 'Not specified',
      contact_email: event.primary_email || 'Not specified',
      contact_phone: event.primary_phone || 'Not specified',
    };
  }

  // Add address
  const addressInfo = {
    address: event.address || 'Not specified',
  };

  // Add menu information if available
  let menuInfo = {};
  if (event.menu_selections) {
    menuInfo = {
      menu_type: event.menu_selections.is_custom ? 'Custom Menu' : 'Standard Menu',
      starter: event.menu_selections.starter_type || 'Not selected',
      main_course: event.menu_selections.main_course_type || 'Not selected',
      dessert: event.menu_selections.dessert_type || 'Not selected',
    };
  }

  return {
    ...formattedEvent,
    ...contactInfo,
    ...addressInfo,
    ...menuInfo
  };
}

export function prepareEventsContext(events: Event[]) {
  if (!events || events.length === 0) {
    return "No events found.";
  }

  // Split into upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate >= today;
  });
  
  const pastEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate < today;
  });

  let eventsContext = '';
  
  // Format upcoming events
  if (upcomingEvents.length > 0) {
    eventsContext += "UPCOMING EVENTS:\n";
    eventsContext += upcomingEvents.map(event => {
      const formattedEvent = formatEventForContext(event);
      return `Event: ${JSON.stringify(formattedEvent, null, 2)}`;
    }).join('\n\n');
  } else {
    eventsContext += "No upcoming events found.\n";
  }
  
  // Only include past events if there are any
  if (pastEvents.length > 0) {
    eventsContext += "\n\nPAST EVENTS (Limited Info):\n";
    eventsContext += pastEvents.slice(0, 5).map(event => {
      return `Event: ${event.name} (${event.event_code}), Date: ${event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Not set'}, Type: ${event.event_type}`;
    }).join('\n');
    
    if (pastEvents.length > 5) {
      eventsContext += `\n...and ${pastEvents.length - 5} more past events`;
    }
  }
  
  return eventsContext;
}

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

export function prepareContactsContext(contacts: any[]) {
  if (!contacts || contacts.length === 0) {
    return "No contacts found.";
  }
  
  return contacts.map(contact => {
    return `Contact: ${JSON.stringify({
      id: contact.id,
      name: contact.full_name || 'Unknown',
      email: contact.email || 'No email',
      phone: contact.mobile || 'No phone',
      surname: contact.surname || 'No surname'
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
      title: doc.title || 'Untitled',
      created_at: doc.created_at ? format(new Date(doc.created_at), 'dd/MM/yyyy') : 'Unknown date',
      updated_at: doc.updated_at ? format(new Date(doc.updated_at), 'dd/MM/yyyy') : 'Unknown date',
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
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  
  let systemMessage = `You are an AI assistant for Warm Karoo, an event planning company. You have FULL ACCESS to all events, tasks, contacts, and documents data.

Current Date: ${currentDate}

HERE IS THE CONTEXT ABOUT EVENTS:
${eventsContext}

HERE IS THE CONTEXT ABOUT CONTACTS:
${contactsContext}

HERE IS THE CONTEXT ABOUT DOCUMENTS:
${documentsContext}`;

  if (tasksContext) {
    systemMessage += `\n\nHERE IS THE CONTEXT ABOUT TASKS:
${tasksContext}`;
  }

  if (pdfContent) {
    systemMessage += `\n\nHERE IS ADDITIONAL INFORMATION FROM DOCUMENTS:
${pdfContent}`;
  }

  systemMessage += `\n\nYOU HAVE FULL ACCESS to all system data including events, tasks, contacts, and documents. You can find, modify, and create data as requested by users.

IMPORTANT INSTRUCTIONS:
1. When asked about events or tasks, ALWAYS check the provided data and give clear answers.
2. Use the format DD/MM/YYYY for dates.
3. For the "next event" question, check the UPCOMING EVENTS section and provide details about the first event.
4. If asked to create, update or delete anything, explain how this can be done through the system.
5. Always maintain a professional, helpful tone representing Warm Karoo.
6. If you don't know something or the data doesn't contain the answer, be honest and say so.`;

  return systemMessage;
}
