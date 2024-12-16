import { Card } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  try {
    // Extract domain from URL
    const domain = new URL(url).hostname.replace('www.', '');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <Card className="w-full max-w-[600px] overflow-hidden hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="flex gap-4 p-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <img 
                  src={faviconUrl} 
                  alt={`${domain} favicon`}
                  className="h-4 w-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Globe className={`h-4 w-4 text-muted-foreground hidden`} />
                <h3 className="font-medium text-lg leading-tight truncate">{domain}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {url}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{domain}</span>
                <ExternalLink className="h-3 w-3" />
              </div>
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