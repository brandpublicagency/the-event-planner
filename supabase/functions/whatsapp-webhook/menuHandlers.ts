import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

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

export const getUpcomingEventsList = async () => {
  console.log('Fetching upcoming events');
  const today = new Date().toISOString();
  
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        wedding_details (*),
        corporate_details (*),
        event_venues (
          venues (
            id,
            name
          )
        )
      `)
      .gte('event_date', today)
      .is('deleted_at', null)
      .order('event_date', { ascending: true })
      .limit(10);

    console.log('Events query result:', { events, error });

    if (error) {
      console.error('Error fetching events:', error);
      return {
        type: 'text',
        message: "Error fetching events. Please try again later."
      };
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "There are no upcoming events scheduled at the moment."
      };
    }

    const sections = events.reduce((acc: any[], event) => {
      const venue = event.event_venues?.[0]?.venues?.name || 'Venue TBC';
      const date = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date TBC';
      
      let description = `📅 ${date}\n📍 ${venue}`;
      if (event.pax) {
        description += `\n👥 ${event.pax} guests`;
      }

      acc.push({
        title: event.event_type === 'wedding' ? '💒 Wedding Events' : '🏢 Corporate Events',
        rows: [{
          id: event.event_code,
          title: event.name,
          description
        }]
      });

      return acc;
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
          text: `Found ${events.length} upcoming event${events.length > 1 ? 's' : ''}. Select an event to view details:`
        },
        action: {
          button: 'View Events',
          sections
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

export const getTaskDetails = async () => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .is('completed', false)
      .order('due_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching tasks:', error);
      return {
        type: 'text',
        message: "Error fetching tasks. Please try again later."
      };
    }

    if (!tasks?.length) {
      return {
        type: 'text',
        message: "No pending tasks found."
      };
    }

    const message = "*Recent Tasks:*\n\n" + tasks.map(task => 
      `• ${task.title}\n  Status: ${task.status.toUpperCase()}\n  Due: ${
        task.due_date ? format(new Date(task.due_date), 'dd MMM yyyy') : 'No due date'
      }`
    ).join('\n\n');

    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Tasks'
        },
        body: {
          text: message
        },
        action: {
          button: 'Task Actions',
          sections: [{
            rows: [
              { id: 'view_all_tasks', title: 'View All Tasks' },
              { id: 'mark_complete', title: 'Mark Task Complete' }
            ]
          }]
        }
      }
    };
  } catch (error) {
    console.error('Error in getTaskDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching tasks. Please try again later."
    };
  }
};