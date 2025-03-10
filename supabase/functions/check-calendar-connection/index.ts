
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
    
    // Validate the Cal.com API key by making a simple request to Cal.com API
    try {
      const calComResponse = await fetch('https://api.cal.com/v1/event-types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CAL_COM_API_KEY}`
        }
      });
      
      if (calComResponse.ok) {
        console.log('Cal.com API key is valid');
        return new Response(
          JSON.stringify({ 
            connected: true,
            message: 'Connected to Cal.com' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      } else {
        console.log('Cal.com API key is invalid');
        return new Response(
          JSON.stringify({ 
            connected: false,
            message: 'Invalid Cal.com API key' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    } catch (apiError) {
      console.error('Error validating Cal.com API key:', apiError);
      return new Response(
        JSON.stringify({ 
          connected: false,
          message: 'Error validating Cal.com API key' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
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
