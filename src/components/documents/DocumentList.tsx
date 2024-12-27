import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Document } from "@/types/document";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function DocumentList({ documents, selectedId, onSelect }: DocumentListProps) {
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
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-center justify-between group px-2 py-1 rounded-md cursor-pointer ${
            selectedId === doc.id ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => onSelect(doc.id)}
        >
          <span className="text-sm truncate flex-1">{doc.title || "Untitled"}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this document?")) {
                deleteDocument.mutate(doc.id);
              }
            }}
            disabled={deleteDocument.isPending}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground/40 hover:text-muted-foreground/60" />
          </Button>
        </div>
      ))}
    </div>
  );
}