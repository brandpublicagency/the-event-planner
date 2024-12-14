import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getNextEvent = async () => {
  try {
    console.log('Fetching next event');
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
    const venues = event.event_venues
      ?.map((v: any) => v.venues?.name)
      .filter(Boolean)
      .join(', ') || 'No venue specified';

    const message = `The next upcoming event is "${event.name}". Here are the details:

- Type: ${event.event_type}
- Date: ${event.event_date ? format(new Date(event.event_date), 'MMMM d, yyyy') : 'Date not set'}
- Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
- Event Code: ${event.event_code}
- Status: Upcoming
- Venue(s): ${venues}
- Pax: ${event.pax || 'Not specified'}
${event.menu_selections ? `- Menu Details:
   - Custom Menu: ${event.menu_selections.is_custom ? 'Yes' : 'No'}
   - Starter: ${event.menu_selections.starter_type || 'Not selected'}
   - Main Course: ${event.menu_selections.main_course_type || 'Not selected'}
   - Dessert: ${event.menu_selections.dessert_type || 'Not selected'}` : ''}

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