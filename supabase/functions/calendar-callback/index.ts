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
    console.log('Handling OAuth callback')
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
      console.error('No code provided in callback')
      return new Response(
        JSON.stringify({ error: 'No code provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('Exchanging code for tokens')
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    console.log('Successfully obtained tokens')

    // Redirect back to the frontend with a success message
    return new Response(
      null,
      { 
        headers: { 
          ...corsHeaders,
          'Location': '/',
        },
        status: 302
      }
    )
  } catch (error) {
    console.error('Error in calendar-callback:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to exchange code for tokens' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})