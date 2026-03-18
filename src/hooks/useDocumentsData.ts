
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/types/document";

export function useDocumentsData() {
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: documents, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error loading documents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as Document[];
    },
    retry: 1,
  });

  const createDocument = useMutation({
    mutationFn: async () => {
      setIsCreatingDocument(true);
      
      try {
        // Get the user session first
        const { data: sessionData } = await supabase.auth.getSession();
        
        // Use the actual user ID if available, otherwise use a placeholder
        // Since RLS is disabled as per project instructions, this will work either way
        const userId = sessionData?.session?.user?.id || "00000000-0000-0000-0000-000000000000";
        const { data, error } = await supabase
          .from("documents")
          .insert({
            title: "Untitled Document",
            content: { type: "doc", html: "", text: "" },
            user_id: userId
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating document:", error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data as Document;
      } finally {
        setIsCreatingDocument(false);
      }
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      toast({
        title: "Success",
        description: "New document created",
      });
    },
    onError: (error: Error) => {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from("documents")
        .update({ 
          deleted_at: new Date().toISOString() 
        })
        .eq("id", documentId);

      if (error) {
        console.error("Error deleting document:", error);
        throw error;
      }
      
      return documentId;
    },
    onSuccess: (documentId) => {
      // Invalidate and refetch the documents query to update the UI
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      toast({
        title: "Document deleted",
        description: "Document has been removed",
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: `Failed to delete document: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    documents,
    isLoading,
    error,
    createDocument,
    deleteDocument,
    isCreatingDocument
  };
}
