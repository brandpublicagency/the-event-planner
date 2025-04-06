
import React from "react";
import { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
    console.log("Document deleted, handling UI update:", documentId);
    
    // If the deleted document was selected, select none
    if (selectedId === documentId) {
      onSelect('');
    }
    
    // Force refresh documents list
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className={cn(
            "group flex items-center justify-between p-1.5 text-sm rounded-md cursor-pointer",
            selectedId === doc.id 
              ? "bg-white text-black border border-black/70" 
              : "hover:bg-accent"
          )}
          onClick={() => onSelect(doc.id)}
        >
          <div className="truncate flex-1">
            {doc.title || "Untitled Document"}
          </div>

          <DocumentDeleteDialog 
            documentId={doc.id}
            documentTitle={doc.title || "Untitled Document"}
            isButton={false}
            onDocumentDeleted={() => handleDocumentDeleted(doc.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
