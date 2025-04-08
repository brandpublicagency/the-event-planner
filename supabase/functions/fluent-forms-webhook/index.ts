
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// These values MUST match exactly what's expected in the database trigger
const ALLOWED_VENUES = [
  "The Kitchen",
  "The Gallery",
  "The Grand Hall",
  "The Lawn",
  "The Avenue",
  "Package 1",
  "Package 2",
  "Package 3"
];

serve(async (req) => {
  console.log("Received request to fluent-forms-webhook");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    if (req.method !== 'POST') {
      console.log(`Method not allowed: ${req.method}`);
      throw new Error('Method not allowed');
    }

    // Parse the raw request body as text first
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Try to parse as JSON if possible
    let formData;
    try {
      formData = JSON.parse(rawBody);
    } catch (e) {
      // If JSON parsing fails, try to parse as URL-encoded form data
      const formDataObj = new URLSearchParams(rawBody);
      formData = Object.fromEntries(formDataObj.entries());
    }
    
    console.log('Processed form data:', formData);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Generate a unique event code
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    const eventCode = `EVENT-${date.getDate()}${date.getMonth() + 1}-${timestamp}`;

    // Improved address handling
    let formattedAddress = null;
    
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

    // Generate contract signing notes
    let eventNotes = null;
    if (formData.contract_signee && formData.accept_terms && formData.terms_date && formData.city_contract) {
      eventNotes = `${formData.contract_signee} accepted the terms and conditions and signed the contract on ${formData.terms_date} in ${formData.city_contract}.`;
      
      // Add contract address if available
      if (formData.city_contract_1) {
        eventNotes += `\nContract address: ${formData.city_contract_1}`;
      }
    }

    // Extract venues properly - improved to handle different formats
    const extractVenues = () => {
      // Check if we have indexed venue fields like venue_choices[0], venue_choices[1]
      const venueKeys = Object.keys(formData).filter(key => key.startsWith('venue_choices['));
      if (venueKeys.length > 0) {
        return venueKeys.map(key => formData[key]).filter(venue => ALLOWED_VENUES.includes(venue));
      }
      // Also check for corporate_venues which is used in some forms
      const corporateVenueKeys = Object.keys(formData).filter(key => key.startsWith('corporate_venues['));
      if (corporateVenueKeys.length > 0) {
        return corporateVenueKeys.map(key => formData[key]).filter(venue => ALLOWED_VENUES.includes(venue));
      }
      // Otherwise try to get venues from user_inputs (comma-separated)
      else if (formData.__submission?.user_inputs?.venue_choices) {
        return formData.__submission.user_inputs.venue_choices
          .split(/,|\+|;|\s+\|\s+/)  // Split by various possible separators
          .map(v => v.trim())
          .filter(v => v && ALLOWED_VENUES.includes(v));
      }
      else if (formData.__submission?.user_inputs?.corporate_venues) {
        return formData.__submission.user_inputs.corporate_venues
          .split(/,|\+|;|\s+\|\s+/)  // Split by various possible separators
          .map(v => v.trim())
          .filter(v => v && ALLOWED_VENUES.includes(v));
      }
      // Fallback to empty array if no venues found
      return [];
    };

    // Get venues and validate them
    const venues = extractVenues();
    console.log('Extracted venues:', venues);
    
    // Explicit mapping for Wedding Confirmation Contract form
    const eventData = {
      event_code: eventCode,
      // Use concat for name to handle nulls gracefully
      name: `${formData.first_name_bride || ''} & ${formData.first_name__groom || ''} Wedding`,
      event_type: "Wedding",
      // Parse date correctly - Fluent Forms sends it in format Y-m-d
      event_date: formData.confirmed_wedding_date || null,
      pax: formData.number_of_guests ? parseInt(formData.number_of_guests) : null,
      // Extract venues with the new function
      venues: venues.length > 0 ? venues : null,
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
      // Added event notes for contract signing details
      event_notes: eventNotes,
      // Additional metadata - keep for backward compatibility
      description: `Contract signed by ${formData.contract_signee || 'Unknown'} on ${formData.terms_date || new Date().toISOString().split('T')[0]}` || null,
    }

    console.log('Mapped event data:', eventData);

    // Check for duplicates within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    let checkField = eventData.primary_email || eventData.secondary_email;
    
    if (checkField) {
      const { data: existingEvents } = await supabase
        .from('events')
        .select('event_code')
        .or(`primary_email.eq.${checkField},secondary_email.eq.${checkField}`)
        .gte('created_at', fiveMinutesAgo);
      
      if (existingEvents && existingEvents.length > 0) {
        console.log('Duplicate submission detected:', existingEvents[0]);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: existingEvents[0],
            message: 'Duplicate submission detected, returning existing event'
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Insert the event data into the events table
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting event:', error);
      throw error;
    }

    console.log('Successfully created event:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
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
    );
  }
});
