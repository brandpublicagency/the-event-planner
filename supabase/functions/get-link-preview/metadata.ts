export const getMetaContent = (html: string, pattern: RegExp, fallback = '') => {
  try {
    const match = html.match(pattern);
    return match ? match[1].trim() : fallback;
  } catch {
    return fallback;
  }
};

export const extractMetadata = (html: string, url: string) => {
  console.log('Extracting metadata for URL:', url);
  
  const title = 
    getMetaContent(html, /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i) ||
    getMetaContent(html, /<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i) ||
    getMetaContent(html, /<title[^>]*>(.*?)<\/title>/i) ||
    new URL(url).hostname;

  const description = 
    getMetaContent(html, /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i) ||
    getMetaContent(html, /<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i) ||
    getMetaContent(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);

  let image = 
    getMetaContent(html, /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
    getMetaContent(html, /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i);

  // Ensure image URL is absolute
  if (image && !image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).toString();
    } catch {
      image = ''; // Clear image if URL parsing fails
    }
  }

  const domain = new URL(url).hostname.replace('www.', '');

  console.log('Extracted metadata:', { title, description, image, domain });
  return { title, description, image, domain };
};