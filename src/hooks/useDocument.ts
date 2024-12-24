import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Document } from "@/types/document";

export function useDocument(documentId: string | null, isAuthenticated: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Document fetch error:", error);
        throw error;
      }

      return data as Document;
    },
    enabled: !!documentId && isAuthenticated,
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        const { data, error } = await supabase
          .from("documents")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Document update error:", error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Save error:", error);
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