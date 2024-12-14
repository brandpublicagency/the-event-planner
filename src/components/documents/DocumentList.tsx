import { cn } from "@/lib/utils";
import { FileText, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Document } from "@/types/document";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showTemplates?: boolean;
}

export default function DocumentList({ 
  documents, 
  selectedId, 
  onSelect,
  showTemplates = false
}: DocumentListProps) {
  const filteredDocs = documents.filter(doc => 
    showTemplates ? doc.template : !doc.template
  );

  return (
    <div className="space-y-1">
      {filteredDocs.map((doc) => (
        <Button
          key={doc.id}
          variant="ghost"
          onClick={() => onSelect(doc.id)}
          className={cn(
            "w-full justify-start gap-2",
            selectedId === doc.id && "bg-accent text-accent-foreground"
          )}
        >
          {doc.template ? (
            <FileCode className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span className="truncate">{doc.title || "Untitled"}</span>
        </Button>
      ))}
      {filteredDocs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents found
        </p>
      )}
    </div>
  );
}