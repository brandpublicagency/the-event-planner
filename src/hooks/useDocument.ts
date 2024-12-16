import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/types/document";

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .is("deleted_at", null)
          .single()
          .timeout(30000); // Increased timeout to 30 seconds

        if (error) {
          console.error("Document fetch error:", error);
          throw error;
        }
        if (!data) throw new Error("Document not found");
        return data as Document;
      } catch (error) {
        if (error instanceof Error && error.message.includes("timeout")) {
          throw new Error("Request timed out. Please try again.");
        }
        throw error;
      }
    },
    enabled: !!documentId && isAuthenticated,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 30000, // Cache results for 30 seconds
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

      try {
        const { error } = await supabase
          .from("documents")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .timeout(30000); // Increased timeout for updates too

        if (error) {
          console.error("Document update error:", error);
          throw error;
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("timeout")) {
          throw new Error("Save operation timed out. Please try again.");
        }
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error("Save error:", error);
      toast({
        title: "Error saving document",
        description: error.message || "Your changes could not be saved. Please try again.",
        variant: "destructive",
      });
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