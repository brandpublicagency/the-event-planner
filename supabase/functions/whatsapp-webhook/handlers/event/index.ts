
import { getEventDetails } from './getEventDetails.ts';
import { getUpcomingEventsList } from './getUpcomingEventsList.ts';
import { getCalendarView } from './getCalendarView.ts';
import { getNextEvent } from './getNextEvent.ts';
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

export {
  getEventDetails,
  getUpcomingEventsList,
  getCalendarView,
  getNextEvent
};

// Add a function to fetch an event by ID for other handlers to use
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchEventById = async (eventCode: string): Promise<any> => {
  // Use the event code exactly as provided
  console.log(`Fetching event with code: ${eventCode}`);
  
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        menu_selections (*),
        event_venues (
          venues (
            name
          )
        )
      `)
      .eq('event_code', eventCode)
      .single();

    if (error) {
      console.error(`Error fetching event ${eventCode}:`, error);
      throw error;
    }

    return event;
  } catch (error) {
    console.error(`Error in fetchEventById for ${eventCode}:`, error);
    return null;
  }
};
