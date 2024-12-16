import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface LinkPreviewProps {
  url: string;
}

interface LinkPreviewData {
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  domain: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const { toast } = useToast();

  const { data: preview, isLoading, error } = useQuery({
    queryKey: ['linkPreview', url],
    queryFn: async () => {
      console.log('Starting preview fetch for:', url);
      
      try {
        // First try to get from cache
        const { data: existingPreview, error: cacheError } = await supabase
          .from('link_previews')
          .select('*')
          .eq('url', url)
          .single();

        if (existingPreview) {
          console.log('Found cached preview:', existingPreview);
          return existingPreview as LinkPreviewData;
        }

        console.log('No cache found, invoking edge function');
        const { data, error } = await supabase.functions.invoke('fetch-link-preview', {
          body: { url },
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No preview data returned');
        }

        console.log('Got preview from edge function:', data);
        
        // Store in database
        const { error: insertError } = await supabase
          .from('link_previews')
          .insert(data);

        if (insertError) {
          console.error('Error caching link preview:', insertError);
          toast({
            title: "Warning",
            description: "Preview was generated but couldn't be cached",
            variant: "destructive",
          });
        }

        return data as LinkPreviewData;
      } catch (error) {
        console.error('Preview fetch error:', error);
        throw error;
      }
    },
    retry: 1,
  });

  if (error) {
    console.error('Preview error:', error);
    return null;
  }

  if (isLoading) {
    return (
      <Card className="my-2">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preview) return null;

  return (
    <Card className="my-2 overflow-hidden">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-start space-x-4 p-4 hover:bg-accent/50 transition-colors"
      >
        {preview.image_url && (
          <div className="flex-shrink-0">
            <img 
              src={preview.image_url} 
              alt={preview.title || 'Link preview'} 
              className="h-16 w-16 object-cover rounded-md"
              onError={(e) => {
                console.log('Image failed to load:', preview.image_url);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">
            {preview.title || preview.domain}
          </h4>
          {preview.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {preview.domain}
          </p>
        </div>
      </a>
    </Card>
  );
}