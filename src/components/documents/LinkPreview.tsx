import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Globe, ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const { data: preview, isLoading } = useQuery({
    queryKey: ["link-preview", url],
    queryFn: async () => {
      try {
        // Extract domain from URL
        const domain = new URL(url).hostname.replace('www.', '');
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        
        // Create a basic preview with the available information
        return {
          title: domain,
          description: url,
          domain: domain,
          favicon: faviconUrl,
          image: null,
        };
      } catch (error) {
        console.error("Link preview error:", error);
        return {
          title: url,
          description: 'Preview unavailable',
          domain: 'unknown',
          favicon: null,
          image: null,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-[600px] overflow-hidden">
        <div className="flex gap-4 p-4">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-24 w-24 rounded" />
        </div>
      </Card>
    );
  }

  if (!preview) return null;

  return (
    <Card className="w-full max-w-[600px] overflow-hidden hover:bg-accent/50 transition-colors">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex gap-4 p-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              {preview.favicon ? (
                <img 
                  src={preview.favicon} 
                  alt={`${preview.domain} favicon`}
                  className="h-4 w-4"
                  onError={(e) => {
                    // Fallback to Globe icon if favicon fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Globe className={`h-4 w-4 text-muted-foreground ${preview.favicon ? 'hidden' : ''}`} />
              <h3 className="font-medium text-lg leading-tight truncate">{preview.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{preview.domain}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
          {preview.image && (
            <div className="flex-shrink-0">
              <img 
                src={preview.image} 
                alt=""
                className="h-24 w-24 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}