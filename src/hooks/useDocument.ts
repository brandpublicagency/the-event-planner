import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Document } from "@/types/document";

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const queryClient = useQueryClient();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId || !isAuthenticated) {
        return null;
      }

      console.log("Fetching document:", documentId);
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Document fetch error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
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
    }) => {
      if (!documentId || !isAuthenticated) {
        throw new Error("Cannot update document: not authenticated");
      }

      console.log("Updating document:", documentId, updates);

      // First verify the document exists and is not deleted
      const { data: existingDoc, error: fetchError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .is("deleted_at", null)
        .maybeSingle();

      if (fetchError) {
        console.error("Error verifying document:", fetchError);
        throw fetchError;
      }
      
      if (!existingDoc) {
        console.error("Document not found or deleted");
        throw new Error("Document not found or deleted");
      }

      // Then perform the update
      const { data, error } = await supabase
        .from("documents")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .is("deleted_at", null)
        .select()
        .single();

      if (error) {
        console.error("Document update error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log("Document updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
    },
  });

  return {
    document,
    isLoading,
    error,
    updateDocument
  };
}