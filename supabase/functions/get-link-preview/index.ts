import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractMetadata } from "./metadata.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIMEOUT_MS = 5000;

serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url
  });

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
    const timeout = setTimeout(() => {
      controller.abort();
      console.log('Request timed out for URL:', url);
    }, TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/html')) {
        console.log('Not an HTML page:', contentType);
        // Return basic info for non-HTML content
        const domain = new URL(url).hostname.replace('www.', '');
        return new Response(
          JSON.stringify({
            title: domain,
            description: `Content type: ${contentType || 'unknown'}`,
            domain,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const html = await response.text();
      console.log('Successfully fetched HTML for URL:', url);

      const metadata = extractMetadata(html, url);
      console.log('Extracted metadata:', metadata);

      return new Response(
        JSON.stringify(metadata),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('Error fetching URL:', fetchError);
      
      // Return a basic preview with just the domain if fetching fails
      const domain = new URL(url).hostname.replace('www.', '');
      return new Response(
        JSON.stringify({
          title: domain,
          description: '',
          image: '',
          domain,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (error) {
    console.error('Error in get-link-preview:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing the link preview request'
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});