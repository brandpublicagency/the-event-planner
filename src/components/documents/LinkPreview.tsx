
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Link, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchLinkPreview } from "@/api/supabaseApi";

interface LinkMetadata {
  url: string;
  title: string;
  description: string | null;
  image_url: string | null;
  domain: string;
  site_name: string;
  favicon: string | null;
}

interface LinkPreviewProps {
  url: string;
  onRemove?: () => void;
  onRetry?: () => void;
  initialLoading?: boolean;
}

// Cache for storing link preview data
const previewCache: Record<string, LinkMetadata> = {};

const LinkPreview = ({ url, onRemove, onRetry, initialLoading = false }: LinkPreviewProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(
    previewCache[url] || null
  );
  const [loading, setLoading] = useState(initialLoading || !previewCache[url]);
  const [error, setError] = useState<Error | null>(null);
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetadata = async () => {
      // If we already have cached data and we're not explicitly retrying
      if (previewCache[url] && !initialLoading) {
        setMetadata(previewCache[url]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchLinkPreview(url);
        console.log('Link preview data:', data);
        
        if (isMounted) {
          setMetadata(data);
          setLoading(false);
          // Cache the result
          previewCache[url] = data;
        }
      } catch (err) {
        console.error('Error fetching link preview:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    };
    
    if (url) {
      fetchMetadata();
    }
    
    return () => {
      isMounted = false;
    };
  }, [url, initialLoading]);

  if (loading) {
    return (
      <div className="border rounded-md p-4 my-2 flex space-x-4 animate-pulse">
        <Skeleton className="h-24 w-24 rounded" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="border rounded-md p-4 my-2 flex items-center gap-2">
        <Link className="h-4 w-4 text-muted-foreground" />
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline flex-1 truncate"
        >
          {url}
        </a>
        <div className="flex gap-2">
          {onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={onRetry}
              title="Retry loading preview"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={onRemove}
              title="Remove preview"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md my-3 overflow-hidden hover:shadow-md transition-shadow relative group">
      <a 
        href={metadata.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block text-inherit no-underline"
      >
        <div className="flex flex-col sm:flex-row">
          {metadata.image_url && !imageError && (
            <div className="sm:w-1/3 h-40 sm:h-auto overflow-hidden bg-slate-100">
              <img 
                src={metadata.image_url} 
                alt={metadata.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          )}
          <div className="p-4 sm:w-2/3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {metadata.favicon && !faviconError && (
                <img 
                  src={metadata.favicon} 
                  alt=""
                  className="w-4 h-4"
                  onError={() => setFaviconError(true)}
                  loading="lazy"
                />
              )}
              <span>{metadata.domain}</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </div>
            <h4 className="text-lg font-medium mt-1">{metadata.title}</h4>
            {metadata.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{metadata.description}</p>
            )}
          </div>
        </div>
      </a>
      {onRemove && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove link preview"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LinkPreview;
