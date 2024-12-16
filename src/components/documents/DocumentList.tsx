import { cn } from "@/lib/utils";
import { FileText, FileCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Document } from "@/types/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredDocs = documents.filter(doc => 
    showTemplates ? doc.template : !doc.template
  );

  return (
    <div className="space-y-1">
      {filteredDocs.map((doc) => (
        <div key={doc.id} className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => onSelect(doc.id)}
            className={cn(
              "flex-1 justify-start gap-2",
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => deleteDocument.mutate(doc.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {filteredDocs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents found
        </p>
      )}
    </div>
  );
}