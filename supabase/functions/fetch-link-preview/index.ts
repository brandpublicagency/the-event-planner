import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    console.log('Processing URL:', url)

    if (!url) {
      throw new Error('URL is required')
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('text/html')) {
      throw new Error('URL does not point to an HTML page')
    }

    const html = await response.text()
    console.log('Successfully fetched HTML')

    // Extract metadata
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim()

    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim()

    const image = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim()

    const domain = new URL(url).hostname

    const preview = {
      url,
      title: title || domain,
      description,
      image_url: image,
      domain,
    }

    console.log('Generated preview:', preview)

    return new Response(
      JSON.stringify(preview),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})