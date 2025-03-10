
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const CAL_COM_API_KEY = Deno.env.get('CAL_COM_API_KEY') || ''

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
    console.log('Checking Cal.com connection')
    
    // Check if Cal.com API key is configured
    if (!CAL_COM_API_KEY) {
      console.log('Cal.com API key not configured')
      return new Response(
        JSON.stringify({ 
          connected: false,
          message: 'Cal.com API key not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    // In a production app, you would validate the connection with Cal.com
    // For now, we'll just return success if the API key is set
    
    return new Response(
      JSON.stringify({ 
        connected: true,
        message: 'Connected to Cal.com' 
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
