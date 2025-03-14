
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { handleError } from '../../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  // Add timeouts to avoid hanging requests
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
    }
  }
});

/**
 * Retrieves a list of upcoming events for WhatsApp display
 */
export const getUpcomingEventsList = async (): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching upcoming events list');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    // Test database connection first with a quick test query
    try {
      console.log('Testing database connection before events query');
      const { data: testData, error: testError } = await supabase
        .from('events')
        .select('count(*)', { count: 'exact', head: true })
        .limit(1);
        
      if (testError) {
        console.error('Database connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Database connection test successful, proceeding with events query');
    } catch (testError) {
      console.error('Error testing database connection:', testError);
      return handleError(testError, 'database connection test');
    }
    
    // First try with a simplified query to see if we can get results
    console.log('Executing main events query');
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        event_date,
        event_type,
        pax,
        event_code
      `)
      .gte('event_date', today.toISOString())
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true })
      .limit(10);

    console.log(`Events query result: ${events?.length || 0} events found`);

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

    // Now fetch venues for these events
    console.log('Fetching venues for events');
    const eventIds = events.map(event => event.id);
    const { data: venueData, error: venueError } = await supabase
      .from('event_venues')
      .select(`
        event_id,
        venues (
          id,
          name
        )
      `)
      .in('event_id', eventIds);
    
    if (venueError) {
      console.error('Error fetching venues:', venueError);
      // Continue without venues
    }
    
    // Create a map of event ID to venues
    const venueMap = new Map();
    if (venueData) {
      venueData.forEach(item => {
        if (item.venues) {
          if (!venueMap.has(item.event_id)) {
            venueMap.set(item.event_id, []);
          }
          venueMap.get(item.event_id).push(item.venues);
        }
      });
      console.log(`Retrieved venue information for ${venueMap.size} events`);
    } else {
      console.log('No venue data available');
    }
    
    // Group events by type
    const weddings = events.filter(event => event.event_type?.toLowerCase() === 'wedding');
    const corporate = events.filter(event => event.event_type?.toLowerCase() === 'corporate');
    const other = events.filter(event => 
      !event.event_type || 
      (event.event_type.toLowerCase() !== 'wedding' && 
       event.event_type.toLowerCase() !== 'corporate')
    );
    
    // Create sections for the list
    const sections = [];
    
    if (weddings.length > 0) {
      sections.push({
        title: '💒 Wedding Events',
        rows: weddings.map(event => createEventRow(event, venueMap.get(event.id)))
      });
    }
    
    if (corporate.length > 0) {
      sections.push({
        title: '🏢 Corporate Events',
        rows: corporate.map(event => createEventRow(event, venueMap.get(event.id)))
      });
    }
    
    if (other.length > 0) {
      sections.push({
        title: '📅 Other Events',
        rows: other.map(event => createEventRow(event, venueMap.get(event.id)))
      });
    }
    
    // If we couldn't categorize properly, use a single section
    if (sections.length === 0 && events.length > 0) {
      sections.push({
        title: '📅 All Upcoming Events',
        rows: events.map(event => createEventRow(event, venueMap.get(event.id)))
      });
    }

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
    return handleError(error, 'getUpcomingEventsList');
  }
};

/**
 * Creates a row object for a WhatsApp list item
 */
function createEventRow(event: any, venues: any[] = []) {
  // Get venue names if available
  const venueName = venues?.length > 0 
    ? venues.map(v => v.name).join(', ')
    : 'Venue TBC';
    
  // Format date
  const date = event.event_date 
    ? format(new Date(event.event_date), 'dd MMM yyyy')
    : 'Date TBC';
  
  // Create description with available info
  let description = `📅 ${date}`;
  
  // Add venue if available (limited to 72 chars)
  if (venueName) {
    const venueText = `\n📍 ${venueName}`;
    if (description.length + venueText.length <= 70) {
      description += venueText;
    }
  }
  
  // Add guest count if available
  if (event.pax) {
    const paxText = `\n👥 ${event.pax} guests`;
    if (description.length + paxText.length <= 70) {
      description += paxText;
    }
  }
  
  // Ensure title is not too long (24 chars max)
  const title = event.name?.length > 24 
    ? event.name.substring(0, 21) + '...'
    : event.name || 'Untitled Event';
  
  return {
    id: `event_${event.event_code}`,
    title: title,
    description: description
  };
}
