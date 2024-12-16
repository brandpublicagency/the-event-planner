import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const title = domain.split('.')[0]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="p-3 space-y-2">
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
              <Globe className="h-4 w-4 text-muted-foreground hidden" />
              <h3 className="font-medium text-sm leading-tight truncate">
                {title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {domain}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {url}
            </p>
          </div>
        </a>
      </Card>
    );
  } catch (error) {
    console.error("Link preview error:", error);
    return null;
  }
}