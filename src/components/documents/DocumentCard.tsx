import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface DocumentCardProps {
  filename: string;
  created_at: string;
  content?: string;
  onDownload: () => void;
}

export const DocumentCard = ({ filename, created_at, content, onDownload }: DocumentCardProps) => {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{filename}</h3>
              <p className="text-sm text-muted-foreground">
                Added: {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {content && (
            <div className="text-sm text-muted-foreground line-clamp-3">
              {content}
            </div>
          )}
          <div className="flex gap-2">
            <Badge variant="secondary">PDF</Badge>
            {content ? (
              <Badge variant="secondary">Processed</Badge>
            ) : (
              <Badge variant="outline">Processing</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};