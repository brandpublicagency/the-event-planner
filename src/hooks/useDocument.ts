
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document, DocumentContent } from "@/types/document";
import { Json } from "@/integrations/supabase/types/json";

export interface DocumentUpdateParams {
  title?: string;
  content?: DocumentContent;
  showToast?: boolean;
}

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) {
        console.log("No document ID provided");
        return null;
      }

      console.log("Fetching document:", documentId);
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select()
          .eq("id", documentId)
          .is("deleted_at", null)
          .maybeSingle();

        if (error) {
          console.error("Document fetch error:", error);
          throw error;
        }

        if (!data) {
          console.log("Document not found:", documentId);
          return null;
        }

        console.log("Document fetch successful");
        return data as Document;
      } catch (error: any) {
        console.error("Document fetch failed:", error.message);
        throw error;
      }
    },
    enabled: !!documentId,
    retry: 1,
  });

  const updateDocument = useMutation({
    mutationFn: async (updates: DocumentUpdateParams) => {
      const { showToast = true, ...documentUpdates } = updates;
      
      if (!documentId) {
        throw new Error("Document ID is required for updates");
      }

      console.log("Updating document:", documentId);

      // First fetch the document to ensure it exists
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

      // Create a proper update object with the content cast as Json
      const updateData: {
        updated_at: string;
        title?: string;
        content?: Json;
      } = {
        updated_at: new Date().toISOString(),
      };
      
      if (documentUpdates.title !== undefined) {
        updateData.title = documentUpdates.title;
      }
      
      if (documentUpdates.content !== undefined) {
        // Cast the DocumentContent to Json type for Supabase
        updateData.content = documentUpdates.content as unknown as Json;
      }

      // Then perform the update
      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", documentId)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Document update error:", error);
        throw error;
      }

      console.log("Document updated successfully");
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
