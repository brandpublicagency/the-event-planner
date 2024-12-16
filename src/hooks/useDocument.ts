import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/types/document";

const TIMEOUT_DURATION = 30000; // 30 seconds

// Utility function to create an abortable fetch with timeout
const createAbortableQuery = (timeoutMs: number = TIMEOUT_DURATION) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeout)
  };
};

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      const { signal, cleanup } = createAbortableQuery();
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .is("deleted_at", null)
          .single()
          .abortSignal(signal);

        cleanup();

        if (error) {
          console.error("Document fetch error:", error);
          throw error;
        }
        if (!data) throw new Error("Document not found");
        return data as Document;
      } catch (error) {
        cleanup();
        if (error instanceof Error && error.name === "AbortError") {
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

      const { signal, cleanup } = createAbortableQuery();

      try {
        const { error } = await supabase
          .from("documents")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .abortSignal(signal);

        cleanup();

        if (error) {
          console.error("Document update error:", error);
          throw error;
        }
      } catch (error) {
        cleanup();
        if (error instanceof Error && error.name === "AbortError") {
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