import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventMenu } from './menuFormatters.ts';
import { formatEventDetails } from './eventFormatters.ts';
import { handleEventQuestion } from './questionHandler.ts';
import { format } from "https://deno.land/x/date_fns@v2.22.1/index.js";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getWelcomeMessage = async () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Welcome! How can I help you today?'
      },
      body: {
        text: 'Please select an option:'
      },
      action: {
        button: 'View Options',
        sections: [{
          title: 'Event Management',
          rows: [
            { id: 'upcoming_events', title: 'View Upcoming Events' },
            { id: 'event_menus', title: 'View Event Menus' },
            { id: 'tasks', title: 'View Tasks' },
            { id: 'calendar', title: 'View Calendar' }
          ]
        }]
      }
    }
  };
};

export const getEventDetails = async (eventCode: string) => {
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      wedding_details (*),
      corporate_details (*),
      menu_selections (*),
      event_venues (
        venues (
          name
        )
      ),
      tasks (
        id,
        title,
        completed,
        due_date,
        priority,
        status
      )
    `)
    .eq('event_code', eventCode)
    .single();

  if (!event) {
    return {
      type: 'text',
      message: "Event not found."
    };
  }

  const message = formatEventDetails(event);
  const tasks = event.tasks || [];
  const tasksSummary = tasks.length > 0 
    ? `\n\n*Related Tasks:*\n${tasks.map(task => 
      `• ${task.title} (${task.status.toUpperCase()})`).join('\n')}`
    : '';

  return {
    type: 'text',
    message: message + tasksSummary
  };
};

export const getTasksList = async () => {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true })
    .limit(10);

  if (!tasks?.length) {
    return {
      type: 'text',
      message: "No tasks found."
    };
  }

  const message = "*Recent Tasks:*\n\n" + tasks.map(task => 
    `• ${task.title}\n  Status: ${task.status.toUpperCase()}\n  Due: ${
      task.due_date ? format(new Date(task.due_date), 'dd MMM yyyy') : 'No due date'
    }`
  ).join('\n\n');

  return {
    type: 'text',
    message
  };
};

export const getCalendarView = async () => {
  const today = new Date();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today.toISOString())
    .order('event_date', { ascending: true })
    .limit(10);

  if (!events?.length) {
    return {
      type: 'text',
      message: "No upcoming events in the calendar."
    };
  }

  const message = "*Upcoming Calendar Events:*\n\n" + events.map(event => 
    `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')}\n${event.name}\n${
      event.event_type
    } (${event.event_code})`
  ).join('\n\n');

  return {
    type: 'text',
    message
  };
};

export const getHelpMessage = () => {
  return {
    type: 'text',
    message: `*Available Commands*
• Send 'hi' or 'hello' to see main menu
• Send 'events' to view upcoming events
• Send 'menu' to view event menus
• Send 'tasks' to view recent tasks
• Send 'calendar' to view upcoming calendar
• Ask any question about events or tasks
• Send 'help' to see this message again`
  };
};

export const handleMessage = async (messageText: string) => {
  const lowercaseMessage = messageText.toLowerCase().trim();
  
  if (['hi', 'hello', 'hey'].includes(lowercaseMessage)) {
    return await getWelcomeMessage();
  } 
  
  if (lowercaseMessage === 'menu') {
    return await getMenuList();
  }

  if (lowercaseMessage === 'tasks') {
    return await getTasksList();
  }

  if (lowercaseMessage === 'calendar') {
    return await getCalendarView();
  }
  
  if (lowercaseMessage === 'help') {
    return getHelpMessage();
  }

  // Handle interactive list responses
  if (['upcoming_events', 'event_menus', 'tasks', 'calendar'].includes(lowercaseMessage)) {
    switch (lowercaseMessage) {
      case 'upcoming_events':
        return await getUpcomingEventsList("Here are the upcoming events:");
      case 'event_menus':
        return await getMenuList();
      case 'tasks':
        return await getTasksList();
      case 'calendar':
        return await getCalendarView();
    }
  }
  
  // Try to handle it as a question about an event
  return await handleEventQuestion(messageText);
};

const getUpcomingEventsList = async (headerText: string) => {
  const today = new Date().toISOString();
  
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      event_venues (
        venues (
          id,
          name
        )
      ),
      menu_selections (*)
    `)
    .gte('event_date', today)
    .is('deleted_at', null)
    .order('event_date', { ascending: true })
    .limit(10);

  if (!events?.length) {
    return {
      type: 'text',
      message: "There are no upcoming events at the moment."
    };
  }

  const sections = events.map(event => ({
    id: event.event_code,
    title: truncateTitle(event.name),
    description: formatEventDate(event.event_date)
  }));

  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: headerText
      },
      body: {
        text: 'Select an event to view details'
      },
      action: {
        button: 'View Events',
        sections: [{
          rows: sections
        }]
      }
    }
  };
};

const formatEventDate = (dateStr: string | null) => {
  if (!dateStr) return 'Date not set';
  
  const date = new Date(dateStr);
  return format(date, 'dd MMMM yyyy');
};

const truncateTitle = (title: string) => {
  const maxLength = 24;
  return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';
};