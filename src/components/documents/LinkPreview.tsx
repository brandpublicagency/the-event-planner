import { Card } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden group hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="p-4 space-y-3">
            {/* Header with favicon and domain */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
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
                <p className="text-sm font-medium text-foreground truncate">
                  {domain}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* URL preview */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground/80 break-all line-clamp-2">
                {url}
              </p>
            </div>
          </div>
        </a>
      </Card>
    );
  } catch (error) {
    console.error("Link preview error:", error);
    return null;
  }
}