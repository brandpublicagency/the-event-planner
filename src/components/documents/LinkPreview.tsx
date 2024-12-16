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
      try {
        // First try to get from cache
        const { data: cachedData, error: cacheError } = await supabase
          .from('link_previews')
          .select('*')
          .eq('url', url)
          .maybeSingle();

        if (cachedData) return cachedData;

        // If not in cache, fetch from Edge Function
        const { data: previewData, error: functionError } = await supabase.functions
          .invoke('get-link-preview', {
            body: { url },
          });

        if (functionError) {
          console.error('Edge function error:', functionError);
          throw functionError;
        }

        if (!previewData) {
          throw new Error('No preview data returned');
        }

        // Cache the result
        const { error: upsertError } = await supabase
          .from('link_previews')
          .upsert({
            url,
            title: previewData.title,
            description: previewData.description,
            image_url: previewData.image,
            domain: previewData.domain,
          });

        if (upsertError) {
          console.error('Cache upsert error:', upsertError);
        }

        return previewData;
      } catch (error) {
        console.error('Link preview error:', error);
        // Return basic fallback data
        return {
          title: new URL(url).hostname.replace('www.', ''),
          description: 'Preview unavailable',
          domain: new URL(url).hostname.replace('www.', ''),
        };
      }
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-[400px] overflow-hidden">
        <Skeleton className="w-full aspect-[1.91/1]" />
        <div className="p-4 space-y-1.5">
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
          <div className="p-4 space-y-1.5">
            <h3 className="font-medium text-base line-clamp-2">
              {preview?.title || `${domain} | Website`}
            </h3>
            {preview?.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {preview.description}
              </p>
            )}
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