
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchEvents = async () => {
  console.log('Fetching events data from database');
  
  try {
    // Use withTimeout to ensure the query doesn't hang indefinitely
    // Use a simpler query structure to avoid relationship errors
    const { data: events, error } = await withTimeout(
      supabase
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: true }),
      'fetchEvents',
      10000
    );

    if (error) {
      handleDbError('fetchEvents', error);
      return [];
    }

    // Fetch menu selections separately to avoid relationship errors
    let menuSelections = [];
    try {
      const { data, error: menuError } = await withTimeout(
        supabase
          .from('menu_selections')
          .select('*'),
        'fetchMenuSelections',
        8000
      );
      
      if (!menuError) {
        menuSelections = data || [];
      }
    } catch (e) {
      console.error('Error fetching menu selections:', e);
    }

    // Combine events with their menu selections
    const enrichedEvents = events?.map(event => {
      const eventMenuSelection = menuSelections.find(menu => 
        menu.event_code === event.event_code
      );
      
      return {
        ...event,
        menu_selections: eventMenuSelection || null
      };
    }) || [];

    console.log(`Successfully fetched ${enrichedEvents.length || 0} events`);
    
    // Log venue information for each event to help debug venue issues
    if (enrichedEvents.length > 0) {
      enrichedEvents.forEach(event => {
        console.log(`Event ${event.event_code} venue data:`, {
          venue_array: event.venues
        });
      });
    }
    
    return enrichedEvents;
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    return [];
  }
};

export const fetchEventById = async (eventCode: string) => {
  console.log(`Fetching event with code: ${eventCode}`);
  
  try {
    // Use the exact event code as provided - no normalization
    const { data: event, error } = await withTimeout(
      supabase
        .from('events')
        .select('*')
        .eq('event_code', eventCode)
        .maybeSingle(),
      'fetchEventById',
      8000
    );

    if (error) {
      handleDbError(`fetchEventById for ${eventCode}`, error);
      return null;
    }
    
    if (!event) {
      console.log(`No event found with code: ${eventCode}`);
      return null;
    }

    // Fetch menu selection separately
    let menuSelection = null;
    try {
      const { data, error: menuError } = await withTimeout(
        supabase
          .from('menu_selections')
          .select('*')
          .eq('event_code', eventCode)
          .maybeSingle(),
        'fetchMenuSelection',
        5000
      );
      
      if (!menuError && data) {
        menuSelection = data;
      }
    } catch (e) {
      console.error(`Error fetching menu selection for ${eventCode}:`, e);
    }
    
    // Combine event with its menu selection
    const enrichedEvent = {
      ...event,
      menu_selections: menuSelection
    };
    
    // Log venue information to help debug venue issues
    console.log(`Event ${event.event_code} venue data:`, {
      venue_array: event.venues
    });

    return enrichedEvent;
  } catch (error) {
    console.error(`Error in fetchEventById for ${eventCode}:`, error);
    return null;
  }
};
