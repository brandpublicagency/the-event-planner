import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || ''
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || ''
const REDIRECT_URI = `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-callback`
const FRONTEND_URL = 'https://your-production-domain.com/calendar'  // Update this with your production URL

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

    if (error) {
      console.error('OAuth error:', error)
      return Response.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No code provided in callback')
      return Response.redirect(`${FRONTEND_URL}?error=no_code`)
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
      return Response.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(tokens.error)}`)
    }

    console.log('Successfully obtained tokens')
    
    return Response.redirect(`${FRONTEND_URL}?success=true`)
  } catch (error) {
    console.error('Error in calendar-callback:', error)
    return Response.redirect(`${FRONTEND_URL}?error=internal_error`)
  }
})