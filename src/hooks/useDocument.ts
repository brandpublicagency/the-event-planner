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
      if (!documentId || !isAuthenticated) {
        return null;
      }

      // First verify the user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching document:", documentId);
      
      const { data, error } = await supabase
        .from("documents")
        .select()
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

      if (!data) {
        console.log("No document found with ID:", documentId);
        return null;
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

      console.log("Updating document:", documentId, updates);

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
        console.error("Document update error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      return data;
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