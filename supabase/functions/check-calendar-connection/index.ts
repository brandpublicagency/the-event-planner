
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

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
    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Extract the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '')

    // Get the user ID from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      throw new Error('User not found')
    }

    // Check if the user has a Google Calendar token stored
    // In a real implementation, you would check in a table where you store the tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    const connected = !!tokens && !tokensError
    
    return new Response(
      JSON.stringify({ 
        connected,
        message: connected ? 'Connected to Google Calendar' : 'Not connected to Google Calendar'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error checking calendar connection:', error)
    return new Response(
      JSON.stringify({ error: error.message, connected: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even for errors to prevent frontend crashes
      }
    )
  }
})
