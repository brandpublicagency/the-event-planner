
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { handleError } from '../../utils/errorHandler.ts';
import { formatEventDetails } from '../../formatters/eventFormatter.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextEvent = async (): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching next event');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // Get the next upcoming event with all the needed relationships
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        menu_selections (*),
        event_venues (
          venues (
            name
          )
        ),
        wedding_details (*),
        corporate_details (*)
      `)
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching next event:', error);
      return handleError(error, 'getNextEvent');
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "No upcoming events found. Would you like to create a new event?"
      };
    }

    const event = events[0];
    console.log('Found next event:', event);
    
    // Use the formatter to create a consistent event display
    const formattedEventDetails = formatEventDetails(event);

    return {
      type: 'text',
      message: formattedEventDetails
    };
  } catch (error) {
    console.error('Error in getNextEvent:', error);
    return handleError(error, 'getNextEvent');
  }
};
