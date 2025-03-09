
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { formatEventDetails } from '../formatters/eventFormatter.ts';
import { handleError } from '../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getEventDetails = async (eventCode: string) => {
  console.log('Fetching event details for:', eventCode);
  
  try {
    if (!eventCode) {
      console.error('Invalid event code provided:', eventCode);
      return {
        type: 'text',
        message: "Sorry, I couldn't find the event you're looking for."
      };
    }

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
      .is('deleted_at', null)
      .is('completed', false)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return {
        type: 'text',
        message: "Error fetching event details. Please try again later."
      };
    }

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
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: message + tasksSummary
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: `menu_${event.event_code}`,
                title: 'View Menu'
              }
            },
            {
              type: 'reply',
              reply: {
                id: `tasks_${event.event_code}`,
                title: 'View Tasks'
              }
            }
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error in getEventDetails:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching event details. Please try again later."
    };
  }
};

export const getUpcomingEventsList = async () => {
  try {
    const today = new Date();
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
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    console.log('Events query result:', { count: events?.length, error });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "There are no upcoming events scheduled at the moment."
      };
    }

    // Group events by type
    const groupedEvents = events.reduce((acc: { [key: string]: any[] }, event) => {
      const type = event.event_type === 'wedding' ? 'Wedding Events' : 'Corporate Events';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(event);
      return acc;
    }, {});

    const sections = Object.entries(groupedEvents).map(([type, events]) => {
      const emoji = type === 'Wedding Events' ? '💒' : '🏢';
      return {
        title: `${emoji} ${type}`,
        rows: events.map(event => {
          const venue = event.event_venues?.[0]?.venues?.name || 'Venue TBC';
          const date = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date TBC';
          
          let description = `📅 ${date}\n📍 ${venue}`;
          if (event.pax) {
            description += `\n👥 ${event.pax} guests`;
          }

          return {
            id: event.event_code,
            title: event.name,
            description
          };
        })
      };
    });

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

export const getCalendarView = async () => {
  try {
    const today = new Date();
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching calendar events:', error);
      return {
        type: 'text',
        message: "Error fetching calendar events. Please try again later."
      };
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events in the calendar."
      };
    }

    const message = "*Upcoming Calendar Events:*\n\n" + events.map(event => 
      `📅 ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Date TBD'}\n${event.name}\n${
        event.event_type
      } (${event.event_code})`
    ).join('\n\n');

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getCalendarView:', error);
    return {
      type: 'text',
      message: "An error occurred while fetching calendar events. Please try again later."
    };
  }
};

export const getNextEvent = async () => {
  try {
    console.log('Fetching next event');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // Simplified query to avoid relationship issues
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching next event:', error);
      throw error;
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events found."
      };
    }

    const event = events[0];
    
    // Get venue information separately if needed
    let venues = "No venue information";
    try {
      const { data: venueData } = await supabase
        .from('event_venues')
        .select('venues(name)')
        .eq('event_code', event.event_code);
        
      if (venueData && venueData.length > 0) {
        venues = venueData
          .map((v: any) => v.venues?.name)
          .filter(Boolean)
          .join(', ');
      }
    } catch (venueError) {
      console.error('Error fetching venues:', venueError);
    }

    // Get client details separately
    let clientDetails = '';
    try {
      if (event.event_type?.toLowerCase() === 'wedding') {
        const { data: weddingData } = await supabase
          .from('wedding_details')
          .select('*')
          .eq('event_code', event.event_code)
          .single();
          
        if (weddingData) {
          clientDetails = `\nClient: Wedding of ${weddingData.bride_name || 'Bride'} & ${weddingData.groom_name || 'Groom'}`;
        }
      } else if (event.event_type?.toLowerCase().includes('corporate')) {
        const { data: corporateData } = await supabase
          .from('corporate_details')
          .select('*')
          .eq('event_code', event.event_code)
          .single();
          
        if (corporateData) {
          clientDetails = `\nClient: ${corporateData.company_name}`;
        }
      }
    } catch (clientError) {
      console.error('Error fetching client details:', clientError);
    }

    // Get menu details separately
    let menuDetails = '\nNo menu details available yet';
    try {
      const { data: menuData } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', event.event_code)
        .single();
        
      if (menuData) {
        menuDetails = `\nMenu Details:
   - Custom Menu: ${menuData.is_custom ? 'Yes' : 'No'}
   - Starter: ${menuData.starter_type || 'Not selected'}
   - Main Course: ${menuData.main_course_type || 'Not selected'}
   - Dessert: ${menuData.dessert_type || 'Not selected'}`;
      }
    } catch (menuError) {
      console.error('Error fetching menu details:', menuError);
    }

    const message = `The next upcoming event is "${event.name}". Here are the details:

Type: ${event.event_type}
Date: ${event.event_date ? format(new Date(event.event_date), 'MMMM d, yyyy') : 'Date not set'}
Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
Venue(s): ${venues}
Pax: ${event.pax || 'Not specified'}${clientDetails}
${menuDetails}

Please let me know if you need more information or other assistance.`;

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getNextEvent:', error);
    return {
      type: 'text',
      message: "I encountered an error fetching the next event. Please try again later."
    };
  }
};
