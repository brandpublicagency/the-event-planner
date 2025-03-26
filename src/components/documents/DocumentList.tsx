
import React from "react";
import { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useDocumentsData } from "@/hooks/useDocumentsData";
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
  const { deleteDocument } = useDocumentsData();

  const handleDocumentDeleted = (documentId: string) => {
    console.log("Document deleted, refreshing list:", documentId);
    // If the deleted document was selected, select none
    if (selectedId === documentId) {
      onSelect('');
    }
  };

  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className={cn(
            "group flex items-center justify-between p-2 text-sm rounded-md cursor-pointer",
            selectedId === doc.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
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
