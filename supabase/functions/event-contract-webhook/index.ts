
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

// Normalize field names from different form sources
const normalizeFormData = (formData: any) => {
  const normalized: any = {};
  
  // Copy all fields to normalized first
  for (const key in formData) {
    // Clean up any fluentform prefixes
    const cleanKey = key.replace(/^_fluentform_\d+_/, '');
    normalized[cleanKey] = formData[key];
  }
  
  // Handle common field mapping patterns
  const fieldMappings: Record<string, string[]> = {
    'name': ['event_name', 'event-name', 'eventName', 'title'],
    'event_type': ['event-type', 'eventType', 'type', 'event_category', 'category'],
    'event_date': ['event-date', 'eventDate', 'date'],
    'start_time': ['start-time', 'startTime'],
    'end_time': ['end-time', 'endTime'],
    'pax': ['guests', 'guest_count', 'guest-count', 'attendees', 'people'],
    'description': ['event_description', 'event-description', 'notes', 'details'],
    'primary_name': ['primary-name', 'primaryName', 'contact_person', 'contact-person', 'contactPerson', 'bride_name', 'bride-name', 'brideName'],
    'primary_phone': ['primary-phone', 'primaryPhone', 'contact_mobile', 'contact-mobile', 'contactMobile', 'bride_mobile', 'bride-mobile', 'brideMobile', 'phone', 'mobile'],
    'primary_email': ['primary-email', 'primaryEmail', 'contact_email', 'contact-email', 'contactEmail', 'bride_email', 'bride-email', 'brideEmail', 'email'],
    'secondary_name': ['secondary-name', 'secondaryName', 'groom_name', 'groom-name', 'groomName', 'secondary_contact', 'secondary-contact'],
    'secondary_phone': ['secondary-phone', 'secondaryPhone', 'groom_mobile', 'groom-mobile', 'groomMobile', 'secondary_mobile', 'secondary-mobile'],
    'secondary_email': ['secondary-email', 'secondaryEmail', 'groom_email', 'groom-email', 'groomEmail', 'secondary_email', 'secondary-email'],
    'company': ['company_name', 'company-name', 'companyName', 'organization', 'client_company', 'client-company'],
    'address': ['company_address', 'company-address', 'companyAddress', 'client_address', 'client-address', 'location'],
    'vat_number': ['company_vat', 'company-vat', 'companyVat', 'tax_number', 'tax-number', 'taxNumber', 'vat', 'tax_id', 'tax-id']
  };
  
  // Apply field mappings
  for (const [standardField, alternativeNames] of Object.entries(fieldMappings)) {
    // If the standard field doesn't exist in normalized data
    if (!normalized[standardField] || normalized[standardField] === '') {
      // Try to find a value from any of the alternative names
      for (const altName of alternativeNames) {
        if (normalized[altName] && normalized[altName] !== '') {
          normalized[standardField] = normalized[altName];
          break;
        }
      }
    }
  }
  
  // Convert venues to array if it's a string
  if (typeof normalized.venues === 'string') {
    normalized.venues = [normalized.venues];
  } else if (!normalized.venues) {
    normalized.venues = [];
  }
  
  // Ensure correct types
  if (normalized.pax && typeof normalized.pax === 'string') {
    const parsedPax = parseInt(normalized.pax);
    normalized.pax = isNaN(parsedPax) ? null : parsedPax;
  }
  
  console.log('Normalized form data:', normalized);
  return normalized;
};

const processFormData = async (formData: any) => {
  console.log('Processing contract form data:', formData);
  
  try {
    // Normalize the form data
    const normalizedData = normalizeFormData(formData);
    
    // Validate required fields
    if (!normalizedData.name || !normalizedData.event_type) {
      throw new Error('Missing required fields: name and event_type are required');
    }
    
    // Generate a unique event code
    const eventCode = await generateEventCode(normalizedData.event_type);
    
    // Extract core event data
    const eventData = {
      name: normalizedData.name,
      event_type: normalizedData.event_type,
      event_code: eventCode,
      event_date: normalizedData.event_date || null,
      start_time: normalizedData.start_time || null,
      end_time: normalizedData.end_time || null,
      pax: normalizedData.pax ? parseInt(normalizedData.pax) : null,
      description: normalizedData.description || null,
      venues: normalizedData.venues || null,
      
      // Contact details
      primary_name: normalizedData.primary_name || normalizedData.contact_person || normalizedData.bride_name || null,
      primary_phone: normalizedData.primary_phone || normalizedData.contact_mobile || normalizedData.bride_mobile || null,
      primary_email: normalizedData.primary_email || normalizedData.contact_email || normalizedData.bride_email || null,
      secondary_name: normalizedData.secondary_name || normalizedData.groom_name || null,
      secondary_phone: normalizedData.secondary_phone || normalizedData.groom_mobile || null,
      secondary_email: normalizedData.secondary_email || normalizedData.groom_email || null,
      
      // Company details
      company: normalizedData.company || normalizedData.company_name || null,
      address: normalizedData.address || normalizedData.company_address || null,
      vat_number: normalizedData.vat_number || normalizedData.company_vat || null,
    };
    
    console.log('Inserting event data:', eventData);
    
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
      
      // First, check if the body contains Fluent Forms data
      if (rawBody.includes('_fluentform_')) {
        const formDataObj = new URLSearchParams(rawBody);
        formData = Object.fromEntries(formDataObj.entries());
        console.log('Detected Fluent Forms data:', formData);
      } else if (contentType.includes('application/json')) {
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
