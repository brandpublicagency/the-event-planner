
/**
 * Parses the request body into form data object based on content type
 */
export const parseFormData = async (req: Request): Promise<any> => {
  // Get the raw request body first
  const rawBody = await req.text();
  console.log('Raw request body:', rawBody);
  
  // Determine content type
  const contentType = req.headers.get('content-type') || '';
  console.log('Content-Type:', contentType);
  
  // First, check if the body contains Fluent Forms data
  if (rawBody.includes('_fluentform_') || rawBody.includes('name_company_contact') || rawBody.includes('event_type=')) {
    const formDataObj = new URLSearchParams(rawBody);
    return Object.fromEntries(formDataObj.entries());
  } else if (contentType.includes('application/json')) {
    // Try parsing as JSON
    try {
      return JSON.parse(rawBody);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      // If JSON parsing fails, try form data as fallback
      return Object.fromEntries(new URLSearchParams(rawBody));
    }
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    // Parse as form data
    return Object.fromEntries(new URLSearchParams(rawBody));
  } else if (contentType.includes('multipart/form-data')) {
    // For multipart form data, we need to use FormData API
    try {
      // Create a new request with the same body but with proper headers for FormData
      const formDataResponse = await fetch(`data:${contentType},${rawBody}`);
      const formDataObj = await formDataResponse.formData();
      return Object.fromEntries(formDataObj);
    } catch (formDataError) {
      console.error('FormData parsing error:', formDataError);
      // Fallback to treating it as URL-encoded
      return Object.fromEntries(new URLSearchParams(rawBody));
    }
  } else {
    // Default fallback - try parsing as URL-encoded
    return Object.fromEntries(new URLSearchParams(rawBody));
  }
};
