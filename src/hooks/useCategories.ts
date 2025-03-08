
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCategories, 
  getDocumentCategories,
  updateDocumentCategories
} from '@/api/supabaseApi';
import { useToast } from './use-toast';
import type { Category } from '@/types/category';

export function useCategories() {
  const { 
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

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
