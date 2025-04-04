
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Define response interface
interface LinkPreviewResponse {
  title: string;
  description: string | null;
  image_url: string | null;
  domain: string;
  url: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Make sure URL is properly formatted
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    
    // Validate URL format
    try {
      new URL(formattedUrl);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Extract domain for fallback display
    const domain = new URL(formattedUrl).hostname.replace(/^www\./, '');
    
    // Fetch the URL content
    console.log(`Fetching URL: ${formattedUrl}`);
    const response = await fetch(formattedUrl, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract metadata from HTML (simple regex approach)
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() || 
                 domain;
                 
    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();
    
    const imageUrl = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                   html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();
    
    // Create response data
    const previewData: LinkPreviewResponse = {
      title: title || domain,
      description: description || null,
      image_url: imageUrl || null,
      domain,
      url: formattedUrl
    };
    
    return new Response(
      JSON.stringify(previewData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error in fetch-link-preview:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
