import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '')

    // Extract the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '')

    // Get the user ID from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      throw new Error('User not found')
    }

    // Get Google Calendar tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (tokensError || !tokens) {
      throw new Error('Google Calendar not connected')
    }

    // Get all events without a Google Calendar ID
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .is('google_calendar_event_id', null)

    if (eventsError) {
      throw new Error('Failed to fetch events')
    }

    // Refresh token if needed
    let accessToken = tokens.access_token
    if (tokens.expires_at < Math.floor(Date.now() / 1000)) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID || '',
          client_secret: GOOGLE_CLIENT_SECRET || '',
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      const refreshData = await tokenResponse.json()
      if (refreshData.error) {
        throw new Error(`Failed to refresh token: ${refreshData.error}`)
      }

      accessToken = refreshData.access_token

      // Update token in database
      await supabase
        .from('google_tokens')
        .update({
          access_token: refreshData.access_token,
          expires_at: Math.floor(Date.now() / 1000) + refreshData.expires_in,
        })
        .eq('user_id', user.id)
    }

    // Sync each event to Google Calendar
    for (const event of events) {
      try {
        const formattedEvent = formatEventForGoogleCalendar(event)
        const calendarEvent = await createGoogleCalendarEvent(formattedEvent, accessToken)

        // Store the Google Calendar event ID
        await supabase
          .from('events')
          .update({ google_calendar_event_id: calendarEvent.id })
          .eq('event_code', event.event_code)

      } catch (error) {
        console.error(`Failed to sync event ${event.event_code}:`, error)
      }
    }

    // Set up webhook for Google Calendar changes
    // This would require additional setup in Google Cloud Console
    // and a new edge function to handle incoming webhooks

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Events synced to Google Calendar'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in sync-all-events:', error)
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
  const location = event.venues?.length > 0
    ? event.venues.map(venue => venue.name || venue).join(', ')
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

// Function to create a Google Calendar event
async function createGoogleCalendarEvent(event, accessToken) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Google Calendar API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}
