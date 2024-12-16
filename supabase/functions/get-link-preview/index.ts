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
        JSON.stringify({ error: 'No URL provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
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
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const metadata = extractMetadata(html, url);
      
      // Cache the metadata in the link_previews table
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );

      await supabaseClient.from('link_previews').upsert({
        url,
        title: metadata.title,
        description: metadata.description,
        image_url: metadata.image,
        domain: metadata.domain,
      }, {
        onConflict: 'url'
      });

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
      
      // Try to get cached preview
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );

      const { data: cachedPreview } = await supabaseClient
        .from('link_previews')
        .select()
        .eq('url', url)
        .single();

      if (cachedPreview) {
        return new Response(
          JSON.stringify({
            title: cachedPreview.title,
            description: cachedPreview.description,
            image: cachedPreview.image_url,
            domain: cachedPreview.domain,
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      // Return basic preview with just the domain
      const domain = new URL(url).hostname.replace('www.', '');
      return new Response(
        JSON.stringify({
          title: domain,
          description: 'Preview unavailable',
          domain: domain,
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
        error: 'Failed to generate preview',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});