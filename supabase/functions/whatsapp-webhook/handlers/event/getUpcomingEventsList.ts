
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getUpcomingEventsList = async (): Promise<WhatsAppResponse> => {
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
