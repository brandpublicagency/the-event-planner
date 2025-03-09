
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const formatEventsContext = (events: any[]) => {
  if (!events || events.length === 0) {
    return "No events found.";
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate >= currentDate;
  });
  
  const pastEvents = events.filter(event => {
    if (!event.event_date) return false;
    const eventDate = new Date(event.event_date);
    return eventDate < currentDate;
  });
  
  let eventsContext = '';
  
  if (upcomingEvents.length > 0) {
    eventsContext += "UPCOMING EVENTS:\n";
    eventsContext += upcomingEvents.map(event => {
      const venues = event.event_venues
        ?.map((v: any) => v.venues?.name)
        .filter(Boolean)
        .join(', ') || 'No venue specified';
      
      const date = event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Date not set';
      
      let clientDetails = '';
      if (event.wedding_details) {
        clientDetails = `Wedding of ${event.wedding_details.bride_name || 'Bride'} & ${event.wedding_details.groom_name || 'Groom'}`;
      } else if (event.corporate_details) {
        clientDetails = `Corporate event for ${event.corporate_details.company_name || 'Company'}`;
      }

      const menuInfo = event.menu_selections 
        ? `Menu: ${event.menu_selections.is_custom ? 'Custom Menu' : 'Standard Menu'}, ` + 
          `Starter: ${event.menu_selections.starter_type || 'Not selected'}, ` +
          `Main: ${event.menu_selections.main_course_type || 'Not selected'}, ` +
          `Dessert: ${event.menu_selections.dessert_type || 'Not selected'}`
        : 'No menu selected';

      return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
Venue: ${venues}
Details: ${clientDetails}
${menuInfo}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}`;
    }).join('\n\n');
  } else {
    eventsContext += "No upcoming events found.\n";
  }
  
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
};

export const formatContactsContext = (contacts: any[]) => {
  if (!contacts || contacts.length === 0) {
    return "No contacts found.";
  }

  return contacts.map(contact => {
    return `Contact: ${contact.full_name || 'Unknown Name'}
Email: ${contact.email || 'No email'}
Phone: ${contact.mobile || 'No phone'}`;
  }).join('\n\n');
};

export const formatDocumentsContext = (documents: any[]) => {
  if (!documents || documents.length === 0) {
    return "No documents found.";
  }

  return documents.map(doc => {
    return `Document: ${doc.title || 'Untitled'}
ID: ${doc.id}
Created: ${doc.created_at ? format(new Date(doc.created_at), 'dd/MM/yyyy') : 'Unknown date'}
Categories: ${doc.document_categories?.map((cat: any) => cat.name).join(', ') || 'None'}`;
  }).join('\n\n');
};

export const formatTasksContext = (tasks: any[]) => {
  if (!tasks || tasks.length === 0) {
    return "No tasks found.";
  }

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
  
  if (overdueTasks.length > 0) {
    tasksContext += "OVERDUE TASKS:\n";
    tasksContext += overdueTasks.map(task => `- ${task.title} (${task.status.toUpperCase()}, Due: ${format(new Date(task.due_date!), 'dd/MM/yyyy')})`).join('\n');
  }
  
  if (todayTasks.length > 0) {
    if (tasksContext) tasksContext += '\n\n';
    tasksContext += "TODAY'S TASKS:\n";
    tasksContext += todayTasks.map(task => `- ${task.title} (${task.status.toUpperCase()})`).join('\n');
  }
  
  if (upcomingTasks.length > 0) {
    if (tasksContext) tasksContext += '\n\n';
    tasksContext += "UPCOMING TASKS:\n";
    tasksContext += upcomingTasks.map(task => `- ${task.title} (${task.status.toUpperCase()}, Due: ${format(new Date(task.due_date!), 'dd/MM/yyyy')})`).join('\n');
  }
  
  if (!tasksContext) {
    tasksContext = "No active tasks found.";
  }
  
  return tasksContext;
};

export const createSystemPrompt = (eventsContext: string, contactsContext: string, documentsContext: string, tasksContext: string) => {
  return `You are a helpful assistant for Warm Karoo, an event planning company. You have FULL ACCESS to all events, tasks, contacts, and documents data. Answer questions with information from this context:

EVENTS:
${eventsContext}

CONTACTS:
${contactsContext}

DOCUMENTS:
${documentsContext}

TASKS:
${tasksContext}

Current date: ${format(new Date(), 'dd/MM/yyyy')}

IMPORTANT INSTRUCTIONS:
1. When asked about events or tasks, ALWAYS check the provided data and give clear answers.
2. Use the format DD/MM/YYYY for dates.
3. For the "next event" question, check the UPCOMING EVENTS section and provide details about the first event.
4. If asked to create, update or delete anything, explain how this can be done through the system.
5. Always maintain a professional, helpful tone representing Warm Karoo.
6. If you don't know something or the data doesn't contain the answer, be honest and say so.`;
};
