
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

    // Improved address handling
    let formattedAddress = null
    
    // Check if we have address fields in the correct format
    if (formData['address_1[address_line_2]'] || formData['address_1[city]'] || 
        formData['address_1[zip]'] || formData['address_1[country]']) {
      
      // Format address with line breaks for better readability
      formattedAddress = [
        formData['address_1[address_line_2]'] || '',
        formData['address_1[city]'] || '',
        formData['address_1[zip]'] || '',
        formData['address_1[country]'] || ''
      ]
      .filter(part => part.trim() !== '')
      .join(', ');
    } 
    // Fall back to original address handling if needed
    else if (formData.address_1) {
      formattedAddress = typeof formData.address_1 === 'string' ? 
        formData.address_1 : 
        `${formData.address_1.address_line_2 || ''}, ${formData.address_1.city || ''}, ${formData.address_1.zip || ''}, ${formData.address_1.country || ''}`.replace(/^[, ]+|[, ]+$/g, '');
    }

    // Explicit mapping for Wedding Confirmation Contract form
    const eventData = {
      event_code: eventCode,
      // Use concat for name to handle nulls gracefully
      name: `${formData.first_name_bride || ''} & ${formData.first_name__groom || ''} Wedding`,
      event_type: "Wedding",
      // Parse date correctly - Fluent Forms sends it in format Y-m-d
      event_date: formData.confirmed_wedding_date || null,
      pax: formData.number_of_guests ? parseInt(formData.number_of_guests) : null,
      // Extract venues properly
      venues: formData.venue_choices || null,
      // Primary contact details (bride)
      primary_name: `${formData.first_name_bride || ''} ${formData.last_name_bride || ''}`.trim() || null,
      primary_email: formData.email_bride || null,
      primary_phone: formData.contact_number_bride || null,
      // Secondary contact details (groom)
      secondary_name: `${formData.first_name__groom || ''} ${formData.last_name__groom || ''}`.trim() || null,
      secondary_email: formData.email || null,
      secondary_phone: formData.groom_contact_number || null,
      // Address with improved handling
      address: formattedAddress,
      // Additional metadata
      description: `Contract signed by ${formData.contract_signee || 'Unknown'} on ${formData.terms_date || new Date().toISOString().split('T')[0]}` || null,
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
