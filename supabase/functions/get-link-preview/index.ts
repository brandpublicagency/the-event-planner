import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractMetadata } from "./metadata.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIMEOUT_MS = 5000; // 5 second timeout

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Fetching preview for URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('Request timed out for URL:', url);
    }, TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
          'Accept': 'text/html',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return new Response(
          JSON.stringify({
            title: new URL(url).hostname.replace('www.', ''),
            description: 'Preview unavailable',
            domain: new URL(url).hostname.replace('www.', ''),
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() || '';
      if (!contentType.includes('text/html')) {
        console.log('Non-HTML content type:', contentType);
        return new Response(
          JSON.stringify({
            title: new URL(url).hostname.replace('www.', ''),
            description: `Content type: ${contentType}`,
            domain: new URL(url).hostname.replace('www.', ''),
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      const html = await response.text();
      const metadata = extractMetadata(html, url);

      return new Response(
        JSON.stringify(metadata),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Error fetching URL:', fetchError);
      
      // Return a basic preview with just the domain if fetching fails
      const domain = new URL(url).hostname.replace('www.', '');
      return new Response(
        JSON.stringify({
          title: domain,
          description: 'Preview unavailable',
          domain,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error in get-link-preview:', error);
    const domain = error.message.includes('URL') ? 'Invalid URL' : 'Error';
    return new Response(
      JSON.stringify({ 
        title: domain,
        description: 'Preview unavailable',
        domain,
        error: error.message
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});