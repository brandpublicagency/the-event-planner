
import { corsHeaders } from "./cors.ts";

/**
 * Creates a JSON response with CORS headers
 */
export const createJsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
};

/**
 * Creates an error response with CORS headers
 */
export const createErrorResponse = (message: string, status = 500) => {
  return new Response(
    JSON.stringify({
      message: message,
      type: "default"
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
};
