import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { formatEventDetails } from '../formatters/eventFormatter.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handleListSelection = async (buttonId: string) => {
  console.log('Handling list selection:', buttonId);
  
  switch (buttonId) {
    case 'upcoming_events':
      return await getUpcomingEventsList();
    case 'event_menus':
      return await getEventMenusList();
    case 'todo_list':
      return await getTodoList();
    default:
      if (buttonId.startsWith('event_')) {
        const eventCode = buttonId.replace('event_', '');
        return await getEventDetails(eventCode);
      }
      return {
        type: 'text',
        message: "Invalid selection. Please try again."
      };
  }
};

const getUpcomingEventsList = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        wedding_details (*),
        corporate_details (*),
        event_venues (
          venues (
            name
          )
        )
      `)
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events found."
      };
    }

    // Group events by type for better organization
    const sections = events.reduce((acc: any[], event) => {
      const date = format(new Date(event.event_date), 'dd MMM yyyy');
      const venue = event.event_venues?.[0]?.venues?.name || 'Venue TBC';
      
      return [...acc, {
        id: `event_${event.event_code}`,
        title: event.name,
        description: `📅 ${date}\n📍 ${venue}\n👥 ${event.pax || 'TBC'} guests`
      }];
    }, []);

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Upcoming Events'
        },
        body: {
          text: `Found ${events.length} upcoming events. Select an event to view details:`
        },
        action: {
          button: 'View Events',
          sections: [{
            title: '📅 Events',
            rows: sections
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getUpcomingEventsList:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching events. Please try again later."
    };
  }
};

const getEventMenusList = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        menu_selections (*)
      `)
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events with menus found."
      };
    }

    const sections = events.reduce((acc: any[], event) => {
      if (!event.menu_selections) return acc;
      
      const date = format(new Date(event.event_date), 'dd MMM yyyy');
      const menuType = event.menu_selections.is_custom ? 'Custom Menu' : 
        `${event.menu_selections.starter_type || ''} ${event.menu_selections.main_course_type || ''}`.trim() || 'Menu TBC';

      return [...acc, {
        id: `event_${event.event_code}`,
        title: event.name,
        description: `📅 ${date}\n🍽️ ${menuType}\n👥 ${event.pax || 'TBC'} guests`
      }];
    }, []);

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Event Menus'
        },
        body: {
          text: `Select an event to view its menu details:`
        },
        action: {
          button: 'View Menus',
          sections: [{
            title: '🍽️ Events with Menus',
            rows: sections
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getEventMenusList:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching event menus. Please try again later."
    };
  }
};

const getTodoList = async () => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .is('completed', false)
      .order('due_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "No pending tasks found."
      };
    }

    const sections = tasks.map(task => ({
      id: `task_${task.id}`,
      title: task.title,
      description: `📅 Due: ${task.due_date ? format(new Date(task.due_date), 'dd MMM yyyy') : 'No due date'}\n⭐ Priority: ${task.priority || 'None'}\n📋 Status: ${task.status}`
    }));

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Your To-do List'
        },
        body: {
          text: `You have ${tasks.length} pending tasks:`
        },
        action: {
          button: 'View Tasks',
          sections: [{
            title: '📋 Tasks',
            rows: sections
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getTodoList:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching tasks. Please try again later."
    };
  }
};

const getEventDetails = async (eventCode: string) => {
  try {
    const { data: event, error } = await supabase
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
        )
      `)
      .eq('event_code', eventCode)
      .single();

    if (error) throw error;

    if (!event) {
      return {
        type: 'text',
        message: "Event not found."
      };
    }

    const formattedDetails = formatEventDetails(event);

    return {
      type: 'text',
      message: formattedDetails
    };
  } catch (error) {
    console.error('Error in getEventDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching event details. Please try again later."
    };
  }
};