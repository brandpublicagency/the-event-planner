import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || ''
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || ''
const REDIRECT_URI = `${Deno.env.get('SUPABASE_URL')}/functions/calendar-callback`

serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'No code provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
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

    // Here you would typically store the tokens securely in your database
    // associated with the user's account

    return new Response(
      JSON.stringify({ message: 'Calendar connected successfully!' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Location': '/' // Redirect to your frontend
        },
        status: 302
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to exchange code for tokens' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})