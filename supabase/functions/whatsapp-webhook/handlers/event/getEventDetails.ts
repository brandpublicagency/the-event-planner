
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { formatEventDetails } from '../../formatters/eventFormatter.ts';
import { handleError } from '../../utils/errorHandler.ts';
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getEventDetails = async (eventCode: string): Promise<WhatsAppResponse> => {
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
