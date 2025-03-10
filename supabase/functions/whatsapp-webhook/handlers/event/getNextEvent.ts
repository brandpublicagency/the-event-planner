
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
    
    console.log('Looking for events after date:', today.toISOString());
    
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

    if (!events || events.length === 0) {
      console.log('No upcoming events found');
      return {
        type: 'text',
        message: "No upcoming events found. Would you like to create a new event?"
      };
    }

    const event = events[0];
    console.log('Found next event:', JSON.stringify(event, null, 2));
    
    // Use the formatter to create a consistent event display
    try {
      const formattedEventDetails = formatEventDetails(event);
      console.log('Formatted event details:', formattedEventDetails);

      return {
        type: 'text',
        message: formattedEventDetails
      };
    } catch (formatError) {
      console.error('Error formatting event details:', formatError);
      
      // Fallback simple format if the formatter fails
      const eventDate = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
      const simplifiedMessage = `*Next Event*\n\n${event.name}\n${eventDate}\nType: ${event.event_type}\nGuests: ${event.pax || 'Not specified'}`;
      
      return {
        type: 'text',
        message: simplifiedMessage
      };
    }
  } catch (error) {
    console.error('Error in getNextEvent:', error);
    return handleError(error, 'getNextEvent');
  }
};
