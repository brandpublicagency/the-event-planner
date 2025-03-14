
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../_shared/response.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a unique event code
const generateEventCode = async (eventType: string) => {
  // Use first 3 letters of event type
  const prefix = eventType.substring(0, 3).toUpperCase();
  const date = new Date();
  // Format: [Event Type Prefix]-[YY][MM]-[Random 3 digits]
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  const baseCode = `${prefix}-${year}${month}-${random}`;
  
  try {
    // Check if code already exists and generate a unique one if needed
    const { data: existingEvent } = await supabase
      .from('events')
      .select('event_code')
      .eq('event_code', baseCode)
      .single();
    
    if (existingEvent) {
      // Try again with a different random number
      return generateEventCode(eventType);
    }
    
    return baseCode;
  } catch (error) {
    // If error is because record not found, code is unique
    return baseCode;
  }
};

const processFormData = async (formData: any) => {
  console.log('Processing contract form data:', formData);
  
  try {
    // Validate required fields
    if (!formData.name || !formData.event_type) {
      throw new Error('Missing required fields: name and event_type are required');
    }
    
    // Generate a unique event code
    const eventCode = await generateEventCode(formData.event_type);
    
    // Extract core event data
    const eventData = {
      name: formData.name,
      event_type: formData.event_type,
      event_code: eventCode,
      event_date: formData.event_date || null,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      pax: formData.pax ? parseInt(formData.pax) : null,
      description: formData.description || null,
      venues: formData.venues || null,
      
      // Contact details
      primary_name: formData.primary_name || formData.contact_person || formData.bride_name || null,
      primary_phone: formData.primary_phone || formData.contact_mobile || formData.bride_mobile || null,
      primary_email: formData.primary_email || formData.contact_email || formData.bride_email || null,
      secondary_name: formData.secondary_name || formData.groom_name || null,
      secondary_phone: formData.secondary_phone || formData.groom_mobile || null,
      secondary_email: formData.secondary_email || formData.groom_email || null,
      
      // Company details
      company: formData.company || formData.company_name || null,
      address: formData.address || formData.company_address || null,
      vat_number: formData.vat_number || formData.company_vat || null,
    };
    
    // Insert event into database
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting event:', error);
      throw error;
    }
    
    // Create initial task for new event
    await supabase
      .from('tasks')
      .insert({
        title: `Initial contact for ${event.name}`,
        user_id: '00000000-0000-0000-0000-000000000000', // System user or will be assigned later
        status: 'todo',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 1 week
        notes: [`New ${event.event_type} event created from contract form`],
      });
    
    return {
      success: true,
      event_code: eventCode,
      message: `Event created successfully with code ${eventCode}`
    };
  } catch (error) {
    console.error('Error processing form data:', error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Received request to event-contract-webhook');
    
    if (req.method !== 'POST') {
      return createErrorResponse('Only POST requests are accepted', 405);
    }
    
    // Parse the request body
    let formData;
    try {
      // Get the raw request body first
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      
      // Determine content type
      const contentType = req.headers.get('content-type') || '';
      console.log('Content-Type:', contentType);
      
      if (contentType.includes('application/json')) {
        // Try parsing as JSON
        try {
          formData = JSON.parse(rawBody);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          // If JSON parsing fails, try form data as fallback
          formData = Object.fromEntries(new URLSearchParams(rawBody));
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Parse as form data
        formData = Object.fromEntries(new URLSearchParams(rawBody));
      } else if (contentType.includes('multipart/form-data')) {
        // For multipart form data, we need to use FormData API
        try {
          // Create a new request with the same body but with proper headers for FormData
          const formDataResponse = await fetch(`data:${contentType},${rawBody}`);
          const formDataObj = await formDataResponse.formData();
          formData = Object.fromEntries(formDataObj);
        } catch (formDataError) {
          console.error('FormData parsing error:', formDataError);
          // Fallback to treating it as URL-encoded
          formData = Object.fromEntries(new URLSearchParams(rawBody));
        }
      } else {
        // Default fallback - try parsing as URL-encoded
        formData = Object.fromEntries(new URLSearchParams(rawBody));
      }
      
      console.log('Parsed form data:', formData);
      
      // Handle Fluent Forms specific format if detected
      if (rawBody.includes('_fluentform_')) {
        const formDataObj = new URLSearchParams(rawBody);
        formData = Object.fromEntries(formDataObj.entries());
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return createErrorResponse('Invalid request body format. Error: ' + parseError.message, 400);
    }
    
    // Process the form data
    const result = await processFormData(formData);
    
    return createJsonResponse(result);
  } catch (error) {
    console.error('Error in event-contract-webhook:', error);
    return createErrorResponse(error.message || 'Internal server error processing event form', 500);
  }
});
