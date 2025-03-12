
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parse the raw request body as text first
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)

    // Try to parse as JSON if possible
    let formData
    try {
      formData = JSON.parse(rawBody)
    } catch (e) {
      // If JSON parsing fails, try to parse as URL-encoded form data
      const formDataObj = new URLSearchParams(rawBody)
      formData = Object.fromEntries(formDataObj.entries())
    }
    
    console.log('Processed form data:', formData)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Generate a unique event code
    const date = new Date()
    const timestamp = date.getTime().toString().slice(-4)
    const eventCode = `EVENT-${date.getDate()}${date.getMonth() + 1}-${timestamp}`

    // Map Fluent Forms data to event table structure
    // Add more detailed logging to see what fields we're receiving
    console.log('Form fields available:', Object.keys(formData))

    const eventData = {
      event_code: eventCode,
      name: formData.event_name || formData['event-name'] || formData.name || 'Untitled Event',
      event_type: formData.event_type || formData['event-type'] || formData.type || 'Wedding',
      event_date: formData.event_date || formData['event-date'] || formData.date || null,
      pax: formData.pax ? parseInt(formData.pax) : null,
      primary_name: formData.primary_name || formData['primary-name'] || formData.name || null,
      primary_email: formData.primary_email || formData['primary-email'] || formData.email || null,
      primary_phone: formData.primary_phone || formData['primary-phone'] || formData.phone || null,
      description: formData.description || formData.message || null,
      venues: formData.venues ? Array.isArray(formData.venues) ? formData.venues : [formData.venues] : null
    }

    console.log('Mapped event data:', eventData)

    // Insert the event data into the events table
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      console.error('Error inserting event:', error)
      throw error
    }

    console.log('Successfully created event:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

