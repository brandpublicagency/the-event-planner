
import { supabase } from '../../utils/dataFetcher/index.ts';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse, withTimeout, withRetry } from '../../utils/timeoutUtils.ts';
import { handleError } from '../../utils/errorHandler.ts';
import { checkDatabaseConnection } from '../../utils/dataFetcher/connectionChecker.ts';

/**
 * Retrieves a list of upcoming events for WhatsApp display
 */
export const getUpcomingEventsList = async (): Promise<WhatsAppResponse> => {
  try {
    console.log('Fetching upcoming events list');
    
    // Perform database connection check first
    const isConnected = await withRetry(
      checkDatabaseConnection,
      'pre-events-list-connection-check',
      2,  // 2 retries
      300  // 300ms initial delay
    );
    
    if (!isConnected) {
      console.error('Database connection check failed before attempting to fetch events');
      return {
        type: 'text',
        message: "I'm having trouble connecting to our database right now. Please try again in a moment."
      };
    }
    
    console.log('Database connection verified, proceeding with events query');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    // Query for upcoming events with timeout and retry
    const { data: events, error } = await withRetry(
      async () => {
        return await withTimeout(
          supabase
            .from('events')
            .select(`
              event_code,
              name,
              event_date,
              event_type,
              pax
            `)
            .gte('event_date', today.toISOString())
            .is('deleted_at', null)
            .is('completed', false)
            .order('event_date', { ascending: true })
            .limit(10),
          'events-query',
          10000  // 10 second timeout
        );
      },
      'fetch-upcoming-events',
      2,  // 2 retries
      500  // 500ms initial delay
    );

    console.log(`Events query result: ${events?.length || 0} events found`);

    if (error) {
      console.error('Error fetching events:', {
        message: error.message || 'Empty error',
        details: error.details,
        code: error.code
      });
      throw error;
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "There are no upcoming events scheduled at the moment."
      };
    }

    // Fetch venues with timeout and retry
    console.log('Fetching venues for events');
    const eventCodes = events.map(event => event.event_code);
    
    const { data: venueData, error: venueError } = await withRetry(
      async () => {
        return await withTimeout(
          supabase
            .from('event_venues')
            .select(`
              event_code,
              venues (
                id,
                name
              )
            `)
            .in('event_code', eventCodes),
          'venues-query',
          8000  // 8 second timeout
        );
      },
      'fetch-event-venues',
      2,  // 2 retries
      300  // 300ms initial delay
    );
    
    if (venueError) {
      console.error('Error fetching venues:', {
        message: venueError.message || 'Empty error',
        details: venueError.details,
        code: venueError.code
      });
      // Continue without venues
    }
    
    // Create a map of event code to venues
    const venueMap = new Map();
    if (venueData) {
      venueData.forEach(item => {
        if (item.venues) {
          if (!venueMap.has(item.event_code)) {
            venueMap.set(item.event_code, []);
          }
          venueMap.get(item.event_code).push(item.venues);
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
        rows: weddings.map(event => createEventRow(event, venueMap.get(event.event_code)))
      });
    }
    
    if (corporate.length > 0) {
      sections.push({
        title: '🏢 Corporate Events',
        rows: corporate.map(event => createEventRow(event, venueMap.get(event.event_code)))
      });
    }
    
    if (other.length > 0) {
      sections.push({
        title: '📅 Other Events',
        rows: other.map(event => createEventRow(event, venueMap.get(event.event_code)))
      });
    }
    
    // If we couldn't categorize properly, use a single section
    if (sections.length === 0 && events.length > 0) {
      sections.push({
        title: '📅 All Upcoming Events',
        rows: events.map(event => createEventRow(event, venueMap.get(event.event_code)))
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
    console.error('Error in getUpcomingEventsList:', {
      message: error.message || 'Empty error message',
      stack: error.stack
    });
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
