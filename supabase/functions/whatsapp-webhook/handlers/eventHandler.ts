import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { formatEventDetails } from '../formatters/eventFormatter.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getUpcomingEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error } = await supabase
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
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching events:', error);
      throw new Error("Error fetching events");
    }

    return events;
  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    throw error;
  }
};

export const getNextEvent = async () => {
  try {
    const events = await getUpcomingEvents();
    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events found."
      };
    }

    const nextEvent = events[0];
    const message = formatEventDetails(nextEvent);

    return {
      type: 'text',
      message
    };
  } catch (error) {
    console.error('Error in getNextEvent:', error);
    throw error;
  }
};