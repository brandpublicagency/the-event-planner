import { Card } from "@/components/ui/card";
import { Globe, ExternalLink, Image } from "lucide-react";
import { useState, useEffect } from "react";

interface LinkPreviewProps {
  url: string;
}

// Placeholder images for when we can't fetch the actual image
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
];

export function LinkPreview({ url }: LinkPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(url, {
          mode: 'no-cors',
          headers: {
            'Accept': 'text/html'
          }
        });

        // Since we're using no-cors, we won't be able to read the response
        // Instead, we'll use a random placeholder image
        const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
        setImageUrl(PLACEHOLDER_IMAGES[randomIndex]);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        // Use first placeholder image as fallback
        setImageUrl(PLACEHOLDER_IMAGES[0]);
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
                onError={() => setImageUrl(PLACEHOLDER_IMAGES[0])}
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