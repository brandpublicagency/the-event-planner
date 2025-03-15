
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { handleError } from '../../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextEvent = async (): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching next event');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    console.log('Looking for events after date:', today.toISOString());
    
    // Get the next upcoming event with a simpler query to avoid relationship errors
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
    
    // Fetch menu selection separately
    let menuInfo = '';
    try {
      const { data: menuSelection, error: menuError } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', event.event_code)
        .maybeSingle();
        
      if (!menuError && menuSelection) {
        const menuType = menuSelection.main_course_type || 
                        (menuSelection.is_custom ? 'Custom menu' : '');
        if (menuType) {
          menuInfo = `\nMenu: ${menuType}`;
        }
      }
    } catch (e) {
      console.error('Error fetching menu info:', e);
    }
    
    // Create a simplified event display
    try {
      const eventDate = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
      
      let venueInfo = '';
      if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
        venueInfo = ` at ${event.venues.join(', ')}`;
      }
      
      const message = `*Next Event*\n\n*${event.name}*\n${eventDate}\nType: ${event.event_type}\nGuests: ${event.pax || 'Not specified'}${venueInfo}${menuInfo}`;
      
      return {
        type: 'text',
        message: message
      };
    } catch (formatError) {
      console.error('Error creating event details:', formatError);
      
      // Extremely simple fallback if all else fails
      return {
        type: 'text',
        message: `Next event: ${event.name} on ${event.event_date}`
      };
    }
  } catch (error) {
    console.error('Error in getNextEvent:', error);
    return handleError(error, 'getNextEvent');
  }
};
