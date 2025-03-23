
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
      console.log("Fetching documents list");
      
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

      console.log("Documents fetched successfully:", data?.length || 0);
      return data as Document[];
    },
    retry: 1,
  });

  const createDocument = useMutation({
    mutationFn: async () => {
      setIsCreatingDocument(true);
      
      try {
        console.log("Creating new document");
        // Use a placeholder user_id since RLS is disabled but the column is required by the database schema
        const placeholderId = "00000000-0000-0000-0000-000000000000";
        
        const { data, error } = await supabase
          .from("documents")
          .insert({
            title: "Untitled Document",
            content: { type: "doc", html: "", text: "" },
            user_id: placeholderId // Add the required user_id field
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
        
        console.log("New document created:", data);
        return data as Document;
      } finally {
        setIsCreatingDocument(false);
      }
    },
    onSuccess: (newDoc) => {
      console.log("Document created successfully, selecting document ID:", newDoc.id);
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

  return {
    documents,
    isLoading,
    error,
    createDocument,
    isCreatingDocument
  };
}
