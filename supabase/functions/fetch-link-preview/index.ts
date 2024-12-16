import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
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

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(url)
    const html = await response.text()

    // Basic metadata extraction
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || null
    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/)?.[1] || null
    const image = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] || null

    const preview = {
      url,
      title,
      description,
      image_url: image,
      domain: extractDomain(url),
    }

    return new Response(
      JSON.stringify(preview),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})