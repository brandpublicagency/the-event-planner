
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../_shared/response.ts';
import { parseFormData } from './parseFormData.ts';
import { processFormData } from './processFormData.ts';

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
      formData = await parseFormData(req);
      console.log('Parsed form data:', JSON.stringify(formData, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return createErrorResponse('Invalid request body format. Error: ' + parseError.message, 400);
    }
    
    // Generate a unique request ID to track duplicate requests
    const requestId = crypto.randomUUID();
    console.log(`Processing form submission with request ID: ${requestId}`);
    
    // Process the form data
    const result = await processFormData(formData);
    
    if (result.isDuplicate) {
      console.log(`Duplicate submission detected. Returning existing event code: ${result.event_code}`);
    } else {
      console.log(`Successfully created new event with code: ${result.event_code}`);
    }
    
    return createJsonResponse(result);
  } catch (error) {
    console.error('Error in event-contract-webhook:', error);
    return createErrorResponse(error.message || 'Internal server error processing event form', 500);
  }
});
