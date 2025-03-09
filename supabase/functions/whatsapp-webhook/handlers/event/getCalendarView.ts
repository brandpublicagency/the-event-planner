
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCalendarView = async (): Promise<WhatsAppResponse> => {
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
