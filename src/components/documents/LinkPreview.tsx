import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  try {
    // Extract domain and create a clean title
    const domain = new URL(url).hostname.replace('www.', '');
    const title = domain.split('.')[0]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <Card className="w-full max-w-[600px] overflow-hidden hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base leading-tight truncate mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <span>{domain}</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-muted">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                alt=""
                className="w-full h-full object-cover"
              />
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