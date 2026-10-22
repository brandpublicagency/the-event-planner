
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getAuthenticatedUserId } from '../_shared/auth.ts'

const isPrivateHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return true;
  if (host === '::1' || host === '::' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80') || host.startsWith('::ffff:')) return true;
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 0 || a === 10 || a === 127 || a >= 224) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  return false;
};

const resolvesToPrivate = async (hostname: string): Promise<boolean> => {
  if (isPrivateHost(hostname)) return true;
  for (const type of ['A', 'AAAA'] as const) {
    try {
      const records = await Deno.resolveDns(hostname, type);
      if (records.some((ip) => isPrivateHost(ip))) return true;
    } catch {
      // no records of this type
    }
  }
  return false;
};

const assertSafeUrl = async (raw: string): Promise<URL> => {
  const parsed = new URL(raw);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
  if (await resolvesToPrivate(parsed.hostname)) throw new Error('Destination not allowed');
  return parsed;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }


    if (typeof url !== 'string' || url.length > 2048) {
      throw new Error('Invalid URL');
    }

    // Follow redirects manually so every hop is checked against private addresses
    let currentUrl = (await assertSafeUrl(url)).toString();
    let response: Response | null = null;
    for (let hop = 0; hop < 5; hop++) {
      response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        },
      });
      const location = response.headers.get('location');
      if (response.status >= 300 && response.status < 400 && location) {
        currentUrl = (await assertSafeUrl(new URL(location, currentUrl).toString())).toString();
        continue;
      }
      break;
    }
    if (!response) throw new Error('No response');

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('text/html')) {
      throw new Error('URL does not point to an HTML page');
    }

    const html = await response.text();

    // Extract metadata
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();

    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                       html.match(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();

    const image = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                 html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();

    const siteName = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i)?.[1]?.trim();
    
    const favicon = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i)?.[1]?.trim() ||
                  html.match(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"[^>]*>/i)?.[1]?.trim();

    const domain = new URL(url).hostname;

    // Normalize relative URLs for favicon and image
    const baseUrl = new URL(url).origin;
    const normalizedImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`) : null;
    const normalizedFavicon = favicon ? (favicon.startsWith('http') ? favicon : `${baseUrl}${favicon.startsWith('/') ? '' : '/'}${favicon}`) : `${baseUrl}/favicon.ico`;

    const preview = {
      url,
      title: title || domain,
      description,
      image_url: normalizedImage,
      domain,
      site_name: siteName || domain,
      favicon: normalizedFavicon
    };


    return new Response(
      JSON.stringify(preview),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Link preview error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to generate link preview.' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
})
