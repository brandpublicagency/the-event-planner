
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface LinkPreviewData {
  title: string;
  description?: string;
  image?: string;
  url: string;
  favicon?: string;
}

export function LinkPreview({ url }: { url: string }) {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!url) return;
    
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        
        const response = await fetch(`https://api.linkpreview.net/?key=9da1016eb780c52e283ab0eb4f099b7c&q=${encodeURIComponent(formattedUrl)}`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        setPreview(data);
      } catch (error) {
        console.error("Link preview error:", error);
        // Fallback to basic URL display
        setPreview({ 
          title: url, 
          url: url.startsWith('http') ? url : `https://${url}` 
        });
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreview();
  }, [url]);
  
  if (loading) {
    return (
      <div className="my-4 border rounded-md p-3 max-w-2xl">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-4/5 mb-3" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    );
  }
  
  if (!preview) {
    return null;
  }
  
  // Check if the URL is valid before trying to display it
  let displayHostname = "";
  try {
    if (preview.url) {
      const urlObj = new URL(preview.url);
      displayHostname = urlObj.hostname;
    }
  } catch (e) {
    console.error("Invalid URL:", preview.url);
    displayHostname = preview.url || "unknown";
  }
  
  return (
    <div className="my-4 border rounded-md overflow-hidden max-w-2xl hover:shadow-md transition-shadow">
      <a 
        href={preview.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block no-underline text-inherit"
      >
        {preview.image && (
          <div className="w-full h-48 overflow-hidden bg-muted">
            <img 
              src={preview.image} 
              alt={preview.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-medium line-clamp-2 m-0">{preview.title}</h3>
            <ExternalLink size={16} className="flex-shrink-0 text-gray-500" />
          </div>
          
          {preview.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 m-0">
              {preview.description}
            </p>
          )}
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            {preview.favicon && (
              <img 
                src={preview.favicon} 
                alt="" 
                className="w-4 h-4 mr-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} 
              />
            )}
            <span className="truncate">{displayHostname}</span>
          </div>
        </div>
      </a>
    </div>
  );
}
