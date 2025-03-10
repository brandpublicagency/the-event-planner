
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { format } from "https://deno.land/std@0.177.0/datetime/format.ts"

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { event } = await req.json()
    
    if (!event) {
      throw new Error('Event data is required')
    }

    console.log('Syncing event to Google Calendar:', event.event_code)

    // Create Supabase client to fetch tokens
    const supabase = createClient(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || ''
    )

    // Fetch the access token for Google Calendar
    // Note: In a production environment, you would store the token in a secure table
    // For this example, we'll simulate the token retrieval
    
    // Format the event for Google Calendar
    const formattedEvent = formatEventForGoogleCalendar(event)
    
    // Call Google Calendar API to create the event
    const calendarEvent = await createGoogleCalendarEvent(formattedEvent)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Event synced to Google Calendar',
        calendarEventId: calendarEvent.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in sync-event-to-calendar:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Helper function to format the event for Google Calendar
function formatEventForGoogleCalendar(event) {
  // Extract start and end times, or use defaults for all-day events
  let startDateTime = event.event_date
  let endDateTime = event.event_date
  
  if (event.start_time) {
    startDateTime = `${event.event_date}T${event.start_time}`
  }
  
  if (event.end_time) {
    endDateTime = `${event.event_date}T${event.end_time}`
  } else if (event.start_time) {
    // Default to 1 hour duration if only start time is provided
    const startDate = new Date(`${event.event_date}T${event.start_time}`)
    startDate.setHours(startDate.getHours() + 1)
    endDateTime = startDate.toISOString().split('.')[0]
  }
  
  // Get venue information if available
  const location = event.venues && event.venues.length > 0
    ? event.venues.join(', ')
    : '';
    
  return {
    summary: event.name,
    description: event.description || `Event Code: ${event.event_code}`,
    location,
    start: {
      dateTime: startDateTime,
      timeZone: 'Africa/Johannesburg',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Africa/Johannesburg',
    },
  }
}

// Simulate creating a Google Calendar event
// In a real implementation, you would use the Google Calendar API
async function createGoogleCalendarEvent(event) {
  console.log('Would create Google Calendar event:', event)
  
  // This is a placeholder. In a real implementation, you would:
  // 1. Get the access token
  // 2. Call the Google Calendar API
  // 3. Save the calendar event ID in your database for future reference
  
  return {
    id: `calendar-event-${Date.now()}`,
    htmlLink: 'https://calendar.google.com',
  }
}

function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          single: () => {
            console.log(`Would select ${columns} from ${table} where ${column} = ${value}`)
            return Promise.resolve({ data: null, error: null })
          }
        })
      }),
      insert: (data) => {
        console.log(`Would insert into ${table}:`, data)
        return Promise.resolve({ data: { id: 'new-id' }, error: null })
      }
    })
  }
}
