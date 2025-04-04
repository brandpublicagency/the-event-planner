
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  url: string;
  title: string;
  description: string | null;
  image_url: string | null;
  domain: string;
  site_name: string | null;
  favicon: string | null;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.functions.invoke("fetch-link-preview", {
          body: { url }
        });
        
        if (error) throw new Error(error.message);
        setPreview(data);
      } catch (err) {
        console.error("Error fetching link preview:", err);
        setError(err instanceof Error ? err.message : "Failed to load preview");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className="border rounded-md p-3 max-w-lg">
        <div className="flex gap-3">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary underline hover:text-primary/80"
      >
        <ExternalLink size={14} />
        {url}
      </a>
    );
  }

  return (
    <a 
      href={preview.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="border rounded-md overflow-hidden flex no-underline text-foreground hover:bg-zinc-50 transition-colors max-w-lg"
    >
      {preview.image_url && (
        <div className="w-24 h-24 flex-shrink-0">
          <img 
            src={preview.image_url} 
            alt={preview.title || "Link preview"} 
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}
      <div className="p-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {preview.favicon && (
            <img 
              src={preview.favicon} 
              alt="" 
              className="w-4 h-4"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <span className="text-xs text-zinc-500 truncate">{preview.domain}</span>
        </div>
        <h4 className="font-medium text-sm truncate mb-1">{preview.title || preview.url}</h4>
        {preview.description && (
          <p className="text-xs text-zinc-600 line-clamp-2">{preview.description}</p>
        )}
      </div>
    </a>
  );
}
