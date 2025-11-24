
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../_shared/response.ts';
import { parseFormData } from './parseFormData.ts';
import { processFormData } from './processFormData.ts';

// Input validation functions
function validateEmail(email: string | null): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string | null): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phone.length >= 10 && phone.length <= 20 && phoneRegex.test(phone);
}

function sanitizeString(input: string | null, maxLength: number = 500): string | null {
  if (!input) return null;
  return input.trim().substring(0, maxLength);
}

function validateFormData(formData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate email fields
  if (formData.primary_email && !validateEmail(formData.primary_email)) {
    errors.push('Invalid primary email format');
  }
  if (formData.secondary_email && !validateEmail(formData.secondary_email)) {
    errors.push('Invalid secondary email format');
  }
  
  // Validate phone fields
  if (formData.primary_phone && !validatePhone(formData.primary_phone)) {
    errors.push('Invalid primary phone format');
  }
  if (formData.secondary_phone && !validatePhone(formData.secondary_phone)) {
    errors.push('Invalid secondary phone format');
  }
  
  // Validate required fields
  if (!formData.event_type || formData.event_type.length > 100) {
    errors.push('Invalid event type');
  }
  
  // Validate PAX is a reasonable number
  if (formData.pax && (isNaN(formData.pax) || formData.pax < 1 || formData.pax > 10000)) {
    errors.push('Invalid number of guests (must be between 1 and 10000)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('============================================');
    console.log('📥 NEW WEBHOOK REQUEST RECEIVED');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('============================================');
    
    if (req.method !== 'POST') {
      return createErrorResponse('Only POST requests are accepted', 405);
    }
    
    // Parse the request body
    let formData;
    try {
      formData = await parseFormData(req);
      console.log('✅ Form data parsed successfully');
      console.log('Form data keys:', Object.keys(formData));
      console.log('Full parsed data:', JSON.stringify(formData, null, 2));
    } catch (parseError) {
      console.error('❌ Error parsing request body:', {
        message: parseError.message,
        stack: parseError.stack
      });
      return createErrorResponse('Invalid request format', 400);
    }
    
    // Validate and sanitize form data
    const validation = validateFormData(formData);
    if (!validation.valid) {
      console.error('❌ Form validation failed:', validation.errors);
      return createErrorResponse(`Validation errors: ${validation.errors.join(', ')}`, 400);
    }
    console.log('✅ Form data validation passed');
    
    // Sanitize string inputs
    formData.name = sanitizeString(formData.name, 200);
    formData.description = sanitizeString(formData.description, 1000);
    formData.primary_name = sanitizeString(formData.primary_name, 200);
    formData.secondary_name = sanitizeString(formData.secondary_name, 200);
    formData.address = sanitizeString(formData.address, 500);
    formData.company = sanitizeString(formData.company, 200);
    formData.event_notes = sanitizeString(formData.event_notes, 2000);
    
    // Generate a unique request ID to track duplicate requests
    const requestId = crypto.randomUUID();
    console.log('📋 Request ID:', requestId);
    
    // Process the form data
    console.log('🔄 Starting form data processing...');
    const result = await processFormData(formData);
    
    if (result.isDuplicate) {
      console.log('⚠️ Duplicate submission detected');
      console.log('Existing event code:', result.event_code);
    } else {
      console.log('✅ Successfully created new event');
      console.log('Event code:', result.event_code);
      console.log('Event name:', result.event_name);
    }
    
    console.log('============================================');
    console.log('✅ WEBHOOK REQUEST COMPLETED SUCCESSFULLY');
    console.log('============================================');
    
    return createJsonResponse(result);
  } catch (error) {
    // Log detailed error server-side only
    console.error('============================================');
    console.error('❌ WEBHOOK REQUEST FAILED');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('============================================');
    
    // Return sanitized error to client
    return createErrorResponse('Unable to process event form. Please try again later.', 500);
  }
});
