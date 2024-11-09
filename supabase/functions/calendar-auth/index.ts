import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || ''
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || ''
const REDIRECT_URI = `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-callback`

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
    console.log('Starting Google Calendar authorization flow')
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=${scopes.join(' ')}` +
      `&access_type=offline` +
      `&prompt=consent`

    console.log('Generated authorization URL')

    return new Response(
      JSON.stringify({ url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in calendar-auth:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate authorization URL' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})