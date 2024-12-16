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
      return data?.[0] || null;
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-[400px] overflow-hidden">
        <Skeleton className="w-full aspect-[1.91/1]" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </Card>
    );
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden group hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {preview?.image_url && (
            <div className="relative w-full aspect-[1.91/1] bg-muted">
              <img 
                src={preview.image_url} 
                alt={preview?.title || domain}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-2.5">
            <h3 className="font-medium text-base line-clamp-2">
              {preview?.title || `${domain} | Website`}
            </h3>
            {preview?.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {preview.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span className="text-sm">{domain}</span>
              <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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