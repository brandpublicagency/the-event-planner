
import React from "react";
import { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { format } from "date-fns";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  categoryFilter: string | null;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedId,
  onSelect,
  categoryFilter
}) => {
  const queryClient = useQueryClient();

  const handleDocumentDeleted = (documentId: string) => {
    if (selectedId === documentId) {
      onSelect('');
    }
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  return (
    <div className="space-y-0.5">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={cn(
            "group flex items-start gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
            selectedId === doc.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
          onClick={() => onSelect(doc.id)}
        >
          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {doc.title || "Untitled"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {format(new Date(doc.updated_at), "MMM d, yyyy")}
            </p>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <DocumentDeleteDialog
              documentId={doc.id}
              documentTitle={doc.title || "Untitled"}
              isButton={false}
              onDocumentDeleted={() => handleDocumentDeleted(doc.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
