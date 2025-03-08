
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getDocumentCategories,
  updateDocumentCategories
} from '@/api/supabaseApi';
import { useToast } from './use-toast';
import type { Category } from '@/types/category';

export function useCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { 
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: { name: string, color?: string }) => 
      createCategory(newCategory.name, newCategory.color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: "Your new category has been created successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (params: { id: string, updates: { name?: string, color?: string } }) => 
      updateCategory(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      toast({
        title: "Category updated",
        description: "The category has been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    categories: categories || [],
    isLoadingCategories,
    categoriesError,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
}

export function useDocumentCategories(documentId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { 
    data: documentCategories,
    isLoading: isLoadingDocumentCategories,
    error: documentCategoriesError
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
      queryClient.invalidateQueries({ queryKey: ['documents'] }); // To update document list with new categories
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
    documentCategories: documentCategories || [],
    isLoadingDocumentCategories,
    documentCategoriesError,
    updateDocumentCategories: updateDocumentCategoriesMutation.mutate,
  };
}
