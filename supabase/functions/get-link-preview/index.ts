import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractMetadata } from "./metadata.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIMEOUT_MS = 8000; // 8 second timeout

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      console.log('No URL provided');
      return new Response(
        JSON.stringify({
          title: 'Invalid URL',
          description: 'No URL provided',
          domain: 'error',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    console.log('Fetching preview for URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status} for URL: ${url}`);
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
        console.log('Non-HTML content type:', contentType, 'for URL:', url);
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
      console.error('Error fetching URL:', url, fetchError);
      
      // Return a basic preview with just the domain
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
  } catch (error) {
    console.error('Error in get-link-preview:', error);
    return new Response(
      JSON.stringify({ 
        title: 'Error',
        description: 'Preview unavailable',
        domain: 'error',
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});