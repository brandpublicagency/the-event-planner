import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractMetadata } from "./metadata.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIMEOUT_MS = 10000; // 10 second timeout
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
];

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
      // Randomly select a user agent
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() || '';
      if (!contentType.includes('text/html')) {
        const domain = new URL(url).hostname.replace('www.', '');
        return new Response(
          JSON.stringify({
            title: domain,
            description: `Content type: ${contentType}`,
            domain,
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const html = await response.text();
      const metadata = extractMetadata(html, url);

      return new Response(
        JSON.stringify(metadata),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
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
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200, // Return 200 even for failed fetches to handle gracefully
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
        status: 200, // Return 200 to handle errors gracefully on the client
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});