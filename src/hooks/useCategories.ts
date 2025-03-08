
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCategories, 
  getDocumentCategories,
  updateDocumentCategories,
  insertPredefinedCategories
} from '@/api/supabaseApi';
import { useToast } from './use-toast';
import type { Category } from '@/types/category';
import { useEffect } from 'react';

export function useCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: categories = [],
    isLoading: isLoadingCategories,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Initialize predefined categories if none exist
  useEffect(() => {
    const initializeCategories = async () => {
      if (categories.length === 0 && !isLoadingCategories) {
        try {
          console.log('No categories found, initializing predefined categories');
          await insertPredefinedCategories();
          // Refetch categories after initialization
          refetch();
        } catch (error) {
          console.error('Error initializing categories:', error);
          toast({
            title: "Error initializing categories",
            description: "Could not create default categories. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    initializeCategories();
  }, [categories.length, isLoadingCategories, refetch, toast]);

  return {
    categories,
    isLoadingCategories
  };
}

export function useDocumentCategories(documentId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { 
    data: documentCategories = [],
    isLoading: isLoadingDocumentCategories
  } = useQuery({
    queryKey: ['documentCategories', documentId],
    queryFn: () => documentId ? getDocumentCategories(documentId) : Promise.resolve([]),
    enabled: !!documentId
  });

  const updateDocumentCategoriesMutation = useMutation({
    mutationFn: (params: { documentId: string, categoryIds: string[] }) => 
      updateDocumentCategories(params.documentId, params.categoryIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentCategories', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Categories updated",
        description: "Document categories have been updated."
      });
    },
    onError: (error: Error) => {
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
    updateDocumentCategories: updateDocumentCategoriesMutation.mutate,
  };
}
