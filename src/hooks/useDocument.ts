
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/types/document";

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId || !isAuthenticated) return null;

      console.log("Fetching document:", documentId);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("documents")
        .select()
        .eq("id", documentId)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Document fetch error:", error);
        toast({
          title: "Error loading document",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Document fetch result:", data);
      return data as Document;
    },
    enabled: !!documentId && isAuthenticated,
  });

  const updateDocument = useMutation({
    mutationFn: async (updates: { 
      title?: string;
      content?: {
        type: 'doc';
        html: string;
        text: string;
      };
      showToast?: boolean;
    }) => {
      const { showToast = true, ...documentUpdates } = updates;
      
      if (!documentId || !isAuthenticated) {
        throw new Error("Cannot update document: not authenticated");
      }

      console.log("Updating document:", documentId, documentUpdates);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      // First fetch the current document to ensure it exists and isn't deleted
      const { data: existingDoc, error: fetchError } = await supabase
        .from("documents")
        .select()
        .eq("id", documentId)
        .is("deleted_at", null)
        .maybeSingle();

      if (fetchError || !existingDoc) {
        console.error("Document fetch error before update:", fetchError);
        throw fetchError || new Error("Document not found");
      }

      // Then perform the update
      const { data, error } = await supabase
        .from("documents")
        .update({
          ...documentUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Document update error:", error);
        toast({
          title: "Error updating document",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Document updated successfully:", data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      
      if (variables.showToast) {
        toast({
          title: "Success",
          description: "Document updated successfully",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Update mutation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    document,
    isLoading,
    error,
    updateDocument
  };
}
