
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
      } else if (event.venues && Array.isArray(event.venues) && event.venues.length > 0) {
        venues = event.venues.join(', ');
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
          .maybeSingle();
          
        if (weddingData) {
          clientDetails = `\nClient: Wedding of ${weddingData.bride_name || 'Bride'} & ${weddingData.groom_name || 'Groom'}`;
        }
      } else if (event.event_type?.toLowerCase().includes('corporate')) {
        const { data: corporateData } = await supabase
          .from('corporate_details')
          .select('*')
          .eq('event_code', event.event_code)
          .maybeSingle();
          
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
        .maybeSingle();
        
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
    return handleError(error, 'getNextEvent');
  }
};
