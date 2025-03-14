
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
  
  console.log('Original form data keys:', Object.keys(formData));
  
  // Event contract form specific fields
  const hasEventContract = formData.name_company_contact || 
                         formData.event_type || 
                         formData.confirmed_event_date || 
                         formData.corporate_venues;
                         
  console.log('Is Event Contract form:', hasEventContract);
  
  // Special handling for event name - combine company name and event type for corporate events
  if (hasEventContract && normalized.company_name && normalized.event_type) {
    normalized.name = `${normalized.company_name} ${normalized.event_type}`.trim();
  } else if (hasEventContract && normalized.name_company_contact && normalized.event_type) {
    // If no company name, use contact person name + event type
    normalized.name = `${normalized.name_company_contact} ${normalized.event_type}`.trim();
  }
  
  // Handle corporate venues field (multiselect)
  if (normalized.corporate_venues) {
    if (typeof normalized.corporate_venues === 'string') {
      normalized.venues = [normalized.corporate_venues];
    } else if (Array.isArray(normalized.corporate_venues)) {
      normalized.venues = normalized.corporate_venues;
    }
  }
  
  // Format address
  let formattedAddress = null;
  if (normalized.address_1) {
    if (typeof normalized.address_1 === 'string') {
      formattedAddress = normalized.address_1;
    } else if (typeof normalized.address_1 === 'object') {
      const addressParts = [
        normalized.address_1.address_line_1,
        normalized.address_1.address_line_2,
        normalized.address_1.city,
        normalized.address_1.state,
        normalized.address_1.zip,
        normalized.address_1.country
      ].filter(part => part && part.trim() !== '');
      
      formattedAddress = addressParts.join(', ');
    }
    
    if (formattedAddress) {
      normalized.address = formattedAddress;
    }
  }
  
  // Generate contract signing notes
  if (normalized.contract_signee && normalized.terms_date) {
    let contractNotes = `Contract signed by ${normalized.contract_signee} on ${normalized.terms_date}`;
    
    if (normalized.city_contract) {
      contractNotes += ` in ${normalized.city_contract}`;
      
      if (normalized.city_contract_1) {
        contractNotes += `, ${normalized.city_contract_1}`;
      }
    }
    
    if (normalized.accept_terms) {
      contractNotes += `. Terms and conditions accepted.`;
    }
    
    normalized.event_notes = contractNotes;
    normalized.description = contractNotes;
  }
  
  // Map primary contact information
  if (normalized.name_company_contact) {
    // Combine first and last name if available
    if (normalized.surname_company_contact) {
      normalized.primary_name = `${normalized.name_company_contact} ${normalized.surname_company_contact}`.trim();
    } else {
      normalized.primary_name = normalized.name_company_contact;
    }
  }
  
  if (normalized.email_bride) {
    normalized.primary_email = normalized.email_bride;
  }
  
  if (normalized.contact_number_contact_person) {
    normalized.primary_phone = normalized.contact_number_contact_person;
  } else if (normalized.contact_number_company) {
    normalized.primary_phone = normalized.contact_number_company;
  }
  
  // Handle confirmed event date
  if (normalized.confirmed_event_date) {
    normalized.event_date = normalized.confirmed_event_date;
  }
  
  // Handle number of guests as pax
  if (normalized.number_of_guests) {
    const parsedPax = parseInt(normalized.number_of_guests);
    normalized.pax = isNaN(parsedPax) ? null : parsedPax;
  }
  
  // Handle common field mapping patterns
  const fieldMappings: Record<string, string[]> = {
    'name': ['event_name', 'event-name', 'eventName', 'title'],
    'event_type': ['event-type', 'eventType', 'type', 'event_category', 'category'],
    'event_date': ['event-date', 'eventDate', 'date', 'confirmed_wedding_date'],
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
  
  // Ensure venues is array
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
      event_notes: normalizedData.event_notes || null,
      
      // Contact details
      primary_name: normalizedData.primary_name || null,
      primary_phone: normalizedData.primary_phone || null,
      primary_email: normalizedData.primary_email || null,
      secondary_name: normalizedData.secondary_name || null,
      secondary_phone: normalizedData.secondary_phone || null,
      secondary_email: normalizedData.secondary_email || null,
      
      // Company details
      company: normalizedData.company || null,
      address: normalizedData.address || null,
      vat_number: normalizedData.vat_number || null,
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
      if (rawBody.includes('_fluentform_') || rawBody.includes('name_company_contact') || rawBody.includes('event_type=')) {
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
