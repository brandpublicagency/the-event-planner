import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || ''
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/calendar-callback`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Handling OAuth callback')
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const state = url.searchParams.get('state') // Get the state parameter

    if (error) {
      console.error('OAuth error:', error)
      return Response.redirect(`${state || 'https://run.gptengineer.app/#/calendar'}?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No code provided in callback')
      return Response.redirect(`${state || 'https://run.gptengineer.app/#/calendar'}?error=no_code`)
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
    
    if (tokens.error) {
      console.error('Token exchange error:', tokens.error)
      return Response.redirect(`${state || 'https://run.gptengineer.app/#/calendar'}?error=${encodeURIComponent(tokens.error)}`)
    }

    console.log('Successfully obtained tokens')
    
    return Response.redirect(`${state || 'https://run.gptengineer.app/#/calendar'}?success=true`)
  } catch (error) {
    console.error('Error in calendar-callback:', error)
    return Response.redirect('https://run.gptengineer.app/#/calendar?error=internal_error')
  }
})