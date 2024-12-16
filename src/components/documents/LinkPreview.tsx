import { Card } from "@/components/ui/card";
import { Globe, ExternalLink, Image } from "lucide-react";
import { useState, useEffect } from "react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Try to find OpenGraph image
        const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);
        if (ogMatch) {
          setImageUrl(ogMatch[1]);
          return;
        }
        
        // Try Twitter image as fallback
        const twitterMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i);
        if (twitterMatch) {
          setImageUrl(twitterMatch[1]);
          return;
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, [url]);

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden group hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {imageUrl ? (
            <div className="relative w-full aspect-[1.91/1] bg-muted">
              <img 
                src={imageUrl} 
                alt={domain}
                className="w-full h-full object-cover"
                onError={() => setImageUrl(null)}
              />
            </div>
          ) : (
            <div className="w-full aspect-[1.91/1] bg-muted flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="p-4 space-y-1.5">
            <h3 className="font-medium text-base line-clamp-2">
              {domain}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="text-xs leading-none">{domain}</span>
              <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </a>
      </Card>
    );
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}