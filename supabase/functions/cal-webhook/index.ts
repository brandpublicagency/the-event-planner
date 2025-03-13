
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { verifyWebhookSignature, generateEventCode } from "./utils.ts";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cal-signature',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Get Cal.com webhook secret from environment variables
const calWebhookSecret = Deno.env.get('CAL_WEBHOOK_SECRET') || '';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the raw request body for signature verification
    const bodyText = await req.text();
    let payload;
    
    try {
      payload = JSON.parse(bodyText);
    } catch (e) {
      console.error('Error parsing webhook payload:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Received Cal.com webhook:', JSON.stringify(payload, null, 2));

    // Get the Cal.com signature from headers
    const signature = req.headers.get('x-cal-signature');
    
    // Verify the webhook signature
    if (!signature || !verifyWebhookSignature(signature, bodyText, calWebhookSecret)) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extract relevant booking information
    const {
      title,
      description,
      startTime,
      endTime,
      uid,
      organizer,
      attendees
    } = payload;

    // Generate a unique event code
    const eventCode = generateEventCode();

    // Format the data for our events table
    const eventData = {
      event_code: eventCode,
      name: title || 'Calendar Booking',
      description: description || '',
      event_type: 'Calendar Appointment',
      event_date: startTime ? new Date(startTime).toISOString().split('T')[0] : null,
      start_time: startTime ? new Date(startTime).toISOString().split('T')[1].substring(0, 5) : null,
      end_time: endTime ? new Date(endTime).toISOString().split('T')[1].substring(0, 5) : null,
      completed: false,
      primary_name: attendees && attendees[0] ? attendees[0].name : '',
      primary_email: attendees && attendees[0] ? attendees[0].email : '',
      external_event_id: uid || null,
    };

    // Insert the event into our database
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error creating event from webhook:', error);
      return new Response(JSON.stringify({ error: 'Failed to create event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Calendar event created successfully',
      eventCode: eventData.event_code
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
