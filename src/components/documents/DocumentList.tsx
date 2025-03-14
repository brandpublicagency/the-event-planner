
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, File } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  categoryFilter?: string | null;
}

export default function DocumentList({ documents, selectedId, onSelect, categoryFilter }: DocumentListProps) {
  return (
    <div className="space-y-1">
      {documents.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-2">
          {categoryFilter && categoryFilter !== 'all' 
            ? "No documents match the selected category" 
            : "No documents found"}
        </div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex flex-col group px-3 py-2 rounded-md cursor-pointer transition-colors ${
              selectedId === doc.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
            }`}
            onClick={() => onSelect(doc.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 overflow-hidden gap-2">
                <File className="h-3.5 w-3.5 text-muted-foreground/70 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{doc.title || "Untitled"}</span>
              </div>
              
              <DocumentDeleteDialog 
                documentId={doc.id} 
                documentTitle={doc.title || "Untitled"} 
                isButton={false}
              />
            </div>
            
            {doc.created_at && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
