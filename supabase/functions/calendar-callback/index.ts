
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || ''
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/calendar-callback`
const DEFAULT_RETURN_URL = 'https://run.gptengineer.app/#/calendar'

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
    const state = url.searchParams.get('state')
    
    // Parse the state parameter which includes the return URL and user ID
    let returnUrl = DEFAULT_RETURN_URL
    let userId = null
    
    if (state) {
      try {
        const stateObj = JSON.parse(decodeURIComponent(state))
        returnUrl = stateObj.returnUrl || DEFAULT_RETURN_URL
        userId = stateObj.userId
      } catch (e) {
        // If parsing fails, use the state directly as the return URL
        returnUrl = state
      }
    }

    console.log('Return URL from state:', returnUrl)
    console.log('User ID from state:', userId)

    if (error) {
      console.error('OAuth error:', error)
      return Response.redirect(`${returnUrl}?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No code provided in callback')
      return Response.redirect(`${returnUrl}?error=no_code`)
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
      return Response.redirect(`${returnUrl}?error=${encodeURIComponent(tokens.error)}`)
    }

    console.log('Successfully obtained tokens')
    
    // Store the tokens in Supabase if we have a user ID
    if (userId) {
      // Create Supabase client
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      
      // Calculate token expiration time
      const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in
      
      // Store tokens in the database
      const { data, error } = await supabase
        .from('google_tokens')
        .upsert({
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
        })
        .select('*')
        .single()
        
      if (error) {
        console.error('Error storing tokens:', error)
        return Response.redirect(`${returnUrl}?error=failed_to_store_tokens`)
      }
      
      console.log('Tokens stored successfully')
    } else {
      console.warn('No user ID provided, cannot store tokens')
    }
    
    console.log('Redirecting to:', `${returnUrl}?success=true`)
    
    return Response.redirect(`${returnUrl}?success=true`)
  } catch (error) {
    console.error('Error in calendar-callback:', error)
    return Response.redirect(`${DEFAULT_RETURN_URL}?error=internal_error`)
  }
})
