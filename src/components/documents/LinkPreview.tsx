import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";

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
        
        // Create a basic preview with the available information
        return {
          title: domain,
          description: url,
          domain: domain,
        };
      } catch (error) {
        console.error("Link preview error:", error);
        return {
          title: url,
          description: 'Preview unavailable',
          domain: 'unknown',
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-[600px] overflow-hidden">
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  if (!preview) return null;

  return (
    <Card className="w-full max-w-[600px] overflow-hidden hover:bg-accent/50 transition-colors">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-lg leading-tight">{preview.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {preview.description}
          </p>
          <p className="text-xs text-muted-foreground">{preview.domain}</p>
        </div>
      </a>
    </Card>
  );
}