import { Card } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const { data: preview, isLoading } = useQuery({
    queryKey: ['link-preview', url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('link_previews')
        .select('*')
        .eq('url', url);

      if (error) throw error;
      // Return the first preview or null if none exists
      return data?.[0] || null;
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-[400px] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden group hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="p-4 space-y-3">
            {/* URL and favicon */}
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 flex-shrink-0">
                <img 
                  src={faviconUrl} 
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Globe className="h-5 w-5 text-muted-foreground hidden absolute inset-0" />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {url}
              </p>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>
            
            {/* Title and description */}
            <div className="space-y-1.5">
              {preview?.title ? (
                <p className="text-sm font-medium line-clamp-2">
                  {preview.title}
                </p>
              ) : (
                <p className="text-sm font-medium line-clamp-2">
                  {domain}
                </p>
              )}
              {preview?.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {preview.description}
                </p>
              )}
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