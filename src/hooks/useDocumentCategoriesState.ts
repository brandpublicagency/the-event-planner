
import { useState, useEffect } from 'react';
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
    
    setSelectedCategories(selected);
  }, [documentCategories, categories]);

  return {
    selectedCategories,
    setSelectedCategories,
    categories,
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories
  };
}
