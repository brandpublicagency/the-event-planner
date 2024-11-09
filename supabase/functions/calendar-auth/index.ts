import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/calendar-callback`
const APP_URL = 'https://run.gptengineer.app'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Google Calendar authorization flow')
    
    if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET) {
      throw new Error('Missing OAuth configuration')
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    const returnUrl = `${APP_URL}/#/calendar`
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(GOOGLE_OAUTH_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&include_granted_scopes=true` +
      `&state=${encodeURIComponent(returnUrl)}`

    console.log('Generated authorization URL:', url)
    console.log('Return URL:', returnUrl)

    return new Response(
      JSON.stringify({ 
        url,
        message: 'Connecting to Google Calendar...'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in calendar-auth:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})