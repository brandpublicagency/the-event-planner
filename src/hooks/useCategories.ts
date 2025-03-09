
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories, getDocumentCategories, updateDocumentCategories, insertPredefinedCategories } from "@/api/supabaseApi";
import { useEffect } from "react";
import type { Category } from "@/types/category";

// Hook for managing all categories
export function useCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Try to insert predefined categories on first load
  useEffect(() => {
    const createPredefinedCategories = async () => {
      try {
        await insertPredefinedCategories();
      } catch (error) {
        console.error("Error creating predefined categories:", error);
      }
    };
    
    createPredefinedCategories();
  }, []);

  const { data: categories = [], isLoading: isLoadingCategories, error } = useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      try {
        return await fetchCategories();
      } catch (error: any) {
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    console.error("Error in useCategories hook:", error);
  }

  return { categories, isLoadingCategories };
}

// Hook for managing document-specific categories
export function useDocumentCategories(documentId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: documentCategories = [], isLoading: isLoadingDocumentCategories } = useQuery({
    queryKey: ['document-categories', documentId],
    queryFn: async () => {
      if (!documentId) return [];
      try {
        return await getDocumentCategories(documentId);
      } catch (error: any) {
        console.error("Error fetching document categories:", error);
        return [];
      }
    },
    enabled: !!documentId,
  });

  const updateDocumentCategoriesMutation = useMutation({
    mutationFn: async ({ 
      documentId, 
      categoryIds, 
      showSuccessToast = true 
    }: { 
      documentId: string, 
      categoryIds: string[],
      showSuccessToast?: boolean
    }) => {
      return await updateDocumentCategories(documentId, categoryIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-categories', documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      if (variables.showSuccessToast) {
        toast({
          title: "Success",
          description: "Document saved",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error updating categories",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories: updateDocumentCategoriesMutation.mutate
  };
}
