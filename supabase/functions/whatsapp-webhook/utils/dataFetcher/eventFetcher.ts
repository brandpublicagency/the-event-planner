
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchEvents = async () => {
  console.log('Fetching events data from database');
  
  try {
    // Use withTimeout to ensure the query doesn't hang indefinitely
    const { data: events, error } = await withTimeout(
      supabase
        .from('events')
        .select(`
          event_code,
          name,
          event_date,
          event_type,
          pax,
          client_address,
          company,
          primary_name,
          secondary_name,
          start_time,
          end_time,
          completed,
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .is('deleted_at', null)
        .order('event_date', { ascending: true }),
      'fetchEvents',
      10000
    );

    if (error) {
      handleDbError('fetchEvents', error);
    }

    console.log(`Successfully fetched ${events?.length || 0} events`);
    return events || [];
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    return [];
  }
};

export const fetchEventById = async (eventCode: string) => {
  console.log(`Fetching event with code: ${eventCode}`);
  
  try {
    const { data: event, error } = await withTimeout(
      supabase
        .from('events')
        .select(`
          event_code,
          name,
          event_date,
          event_type,
          pax,
          client_address,
          company,
          primary_name,
          secondary_name,
          start_time,
          end_time,
          completed,
          menu_selections (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .eq('event_code', eventCode)
        .maybeSingle(),
      'fetchEventById',
      8000
    );

    if (error) {
      handleDbError(`fetchEventById for ${eventCode}`, error);
    }

    return event;
  } catch (error) {
    console.error(`Error in fetchEventById for ${eventCode}:`, error);
    return null;
  }
};
