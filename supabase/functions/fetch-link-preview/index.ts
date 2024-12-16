import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    console.error('Invalid URL:', url);
    return '';
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    console.log('Fetching preview for URL:', url);

    if (!url) {
      console.error('No URL provided');
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0;)'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch URL:', url, 'Status:', response.status);
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    console.log('Successfully fetched HTML for:', url);

    // Basic metadata extraction with better fallbacks
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim() || 
                 html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/)?.[1]?.trim() ||
                 null;

    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)?.[1]?.trim() ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/)?.[1]?.trim() || 
                       null;

    const image = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/)?.[1]?.trim() ||
                 html.match(/<link[^>]*rel="image_src"[^>]*href="([^"]*)"[^>]*>/)?.[1]?.trim() ||
                 null;

    const preview = {
      url,
      title,
      description,
      image_url: image,
      domain: extractDomain(url),
    }

    console.log('Generated preview:', preview);

    return new Response(
      JSON.stringify(preview),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing link preview:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})