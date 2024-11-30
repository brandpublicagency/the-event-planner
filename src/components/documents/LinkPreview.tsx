import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title: string;
  description?: string;
  image?: string;
  domain: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const { data: preview, isLoading } = useQuery({
    queryKey: ["link-preview", url],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<PreviewData>("get-link-preview", {
        body: { url }
      });
      
      if (error) throw error;
      return data;
    },
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
        {preview.image && (
          <div className="relative h-[200px] w-full">
            <img 
              src={preview.image} 
              alt={preview.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-lg leading-tight">{preview.title}</h3>
          {preview.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{preview.domain}</p>
        </div>
      </a>
    </Card>
  );
}