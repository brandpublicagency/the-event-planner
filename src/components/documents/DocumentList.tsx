
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, File } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import type { Document } from "@/types/document";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  categoryFilter?: string | null;
}

export default function DocumentList({ documents, selectedId, onSelect, categoryFilter }: DocumentListProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
      console.log("Deleting document:", documentId);
      
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", documentId)
        .is("deleted_at", null);

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Failed to delete document: ${error.message}`);
      }
      
      return documentId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      if (selectedId === deletedId) {
        navigate('/documents');
      }
    },
    onError: (error: Error) => {
      console.error("Delete mutation error:", error);
    },
  });

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
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to delete this document?")) {
                    deleteDocument.mutate(doc.id);
                  }
                }}
                disabled={deleteDocument.isPending}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-destructive transition-colors" />
              </Button>
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
