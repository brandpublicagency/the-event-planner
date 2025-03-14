
import { corsHeaders } from './cors.ts';

/**
 * Creates a JSON response with proper headers
 */
export const createJsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Creates an error response with appropriate status code and message
 */
export const createErrorResponse = (message: string, status = 400) => {
  return createJsonResponse({ error: message }, status);
};
