import { Card } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    return (
      <Card className="w-full max-w-[400px] overflow-hidden group hover:bg-accent/50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="p-4 space-y-1.5">
            <h3 className="font-medium text-base line-clamp-2">
              {domain}
            </h3>
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