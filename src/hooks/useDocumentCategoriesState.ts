
import { useState, useEffect, useCallback } from 'react';
import { useDocumentCategories, useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/category";

export function useDocumentCategoriesState(documentId: string | null) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  
  const {
    categories
  } = useCategories();
  
  const {
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories
  } = useDocumentCategories(documentId);

  // Update selectedCategories when documentCategories or categories change
  useEffect(() => {
    if (!documentCategories || !categories) return;
    
    const selected = documentCategories.map(docCat => {
      const fullCategory = categories.find(c => c.id === docCat.id);
      return fullCategory || docCat;
    });
    
    // Only update if the selection has actually changed
    // This prevents the infinite loop
    if (JSON.stringify(selected) !== JSON.stringify(selectedCategories)) {
      setSelectedCategories(selected);
    }
  }, [documentCategories, categories, selectedCategories]);

  // Memoize the update function to prevent recreating it on each render
  const handleUpdateCategories = useCallback(async (categoryId: string | null) => {
    if (!documentId) return;

    const categoryIds = categoryId ? [categoryId] : [];
    await updateDocumentCategories({
      documentId,
      categoryIds,
      showSuccessToast: true
    });
  }, [documentId, updateDocumentCategories]);

  return {
    selectedCategories,
    setSelectedCategories,
    categories,
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories,
    handleUpdateCategories
  };
}
