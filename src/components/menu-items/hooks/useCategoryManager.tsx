
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseCategoryManagerProps {
  items: any[];
}

export const useCategoryManager = ({ items }: UseCategoryManagerProps) => {
  const queryClient = useQueryClient();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>('');
  const [selectedChoiceLabel, setSelectedChoiceLabel] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditCategory = (category: string) => {
    if (category === 'Uncategorized') {
      toast.error('Cannot edit the Uncategorized category');
      return;
    }
    const itemInCategory = items.find(item => item.category === category);
    if (!itemInCategory || !itemInCategory.choice_id) {
      toast.error('Cannot determine choice for this category');
      return;
    }
    setSelectedChoiceId(itemInCategory.choice_id);
    setSelectedChoiceLabel(itemInCategory.choice || 'Menu Items');
    setIsCategoryManagerOpen(true);
  };

  const handleDeleteCategory = (category: string) => {
    if (category === 'Uncategorized') {
      toast.error('Cannot delete the Uncategorized category');
      return;
    }
    const itemInCategory = items.find(item => item.category === category);
    if (!itemInCategory || !itemInCategory.choice_id) {
      toast.error('Cannot determine choice for this category');
      return;
    }
    setCategoryToDelete(category);
    setSelectedChoiceId(itemInCategory.choice_id);
    setIsDeleteDialogOpen(true);
  };

  const performDelete = async () => {
    if (!categoryToDelete || !selectedChoiceId) {
      toast.error('Missing category or choice ID');
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          category: null
        })
        .eq('category', categoryToDelete)
        .eq('choice_id', selectedChoiceId);

      if (error) throw error;
      
      toast.success(`Category "${categoryToDelete}" deleted successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['menuItems']
      });
      queryClient.invalidateQueries({
        queryKey: ['menuItems', selectedChoiceId]
      });
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-list']
      });
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-list', selectedChoiceId]
      });
      
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      setSelectedChoiceId('');
    } catch (error: any) {
      toast.error(`Error deleting category: ${error.message}`);
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    selectedChoiceId,
    selectedChoiceLabel,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    categoryToDelete,
    isDeleting,
    handleEditCategory,
    handleDeleteCategory,
    performDelete
  };
};
