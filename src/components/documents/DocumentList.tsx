
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Document } from "@/types/document";
import type { Category } from "@/types/category";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  categoryFilter?: string | null;
}

export default function DocumentList({ documents, selectedId, onSelect, categoryFilter }: DocumentListProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all categories to use for filtering
  const { data: allCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      return data;
    }
  });

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

  // Filter documents by category if a filter is active
  const filteredDocuments = categoryFilter
    ? documents.filter(doc => 
        doc.category_ids && 
        doc.category_ids.includes(categoryFilter)
      )
    : documents;

  return (
    <div className="space-y-1">
      {isLoadingCategories ? (
        <div className="text-sm text-muted-foreground text-center py-2">Loading...</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-2">
          {categoryFilter ? "No documents match the selected category" : "No documents found"}
        </div>
      ) : (
        filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className={`flex flex-col justify-between group px-2 py-1 rounded-md cursor-pointer ${
              selectedId === doc.id ? "bg-accent" : "hover:bg-accent/50"
            }`}
            onClick={() => onSelect(doc.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 overflow-hidden">
                <span className="text-sm truncate">{doc.title || "Untitled"}</span>
              </div>
              
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
          </div>
        ))
      )}
    </div>
  );
}
