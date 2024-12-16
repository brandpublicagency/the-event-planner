import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestBody {
  url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as RequestBody;

    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Fetching preview for URL:', url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Basic metadata extraction with error handling and fallbacks
      const getMetaContent = (pattern: RegExp, fallback = '') => {
        try {
          const match = html.match(pattern);
          return match ? match[1].trim() : fallback;
        } catch {
          return fallback;
        }
      };

      // Try multiple meta tags with fallbacks
      const title = 
        getMetaContent(/<title>(.*?)<\/title>/i) ||
        getMetaContent(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i) ||
        getMetaContent(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i) ||
        new URL(url).hostname;

      const description = 
        getMetaContent(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
        getMetaContent(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i) ||
        getMetaContent(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i);

      const image = 
        getMetaContent(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
        getMetaContent(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i);

      const domain = new URL(url).hostname.replace('www.', '');

      console.log('Successfully extracted preview data:', { title, domain });

      return new Response(
        JSON.stringify({
          title: title || domain,
          description,
          image,
          domain,
        }),
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
        details: 'Failed to generate link preview',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});