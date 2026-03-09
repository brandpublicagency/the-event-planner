
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
    <div className="space-y-px">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={cn(
            "group flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer transition-colors",
            selectedId === doc.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 text-foreground"
          )}
          onClick={() => onSelect(doc.id)}
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-normal truncate leading-tight">
              {doc.title || "Untitled"}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
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
