import React, { useMemo, useEffect, useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CategoryManagerDialog from './CategoryManagerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
interface MenuItemsByCategoryProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}
const MenuItemsByCategory: React.FC<MenuItemsByCategoryProps> = ({
  items,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const queryClient = useQueryClient();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>('');
  const [selectedChoiceLabel, setSelectedChoiceLabel] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting2, setIsDeleting2] = useState(false);
  useEffect(() => {
    if (items.length > 0) {
      console.log("MenuItemsByCategory: Forcing refresh of menu items and categories");
      const choiceId = items[0].choice_id;
      queryClient.invalidateQueries({
        queryKey: ['menuItems', choiceId]
      });
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-list', choiceId]
      });
    }
  }, [items, queryClient]);
  const categorizedItems = useMemo(() => {
    console.log("Grouping items by category:", items);
    const grouped: Record<string, MenuItem[]> = {};
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      grouped['Uncategorized'] = uncategorizedItems;
    }
    items.forEach(item => {
      if (item.category) {
        console.log(`Found item with category: ${item.label} - ${item.category}`);
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      }
    });
    console.log("Grouped items:", grouped);
    return grouped;
  }, [items]);
  const allCategories = useMemo(() => {
    const categories = Object.keys(categorizedItems).sort();
    if (categories.includes('Uncategorized')) {
      return ['Uncategorized', ...categories.filter(c => c !== 'Uncategorized')];
    }
    console.log("All categories detected:", categories);
    return categories;
  }, [categorizedItems]);
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
    setIsDeleting2(true);
    try {
      const {
        error
      } = await supabase.from('menu_items').update({
        category: null
      }).eq('category', categoryToDelete).eq('choice_id', selectedChoiceId);
      if (error) throw error;
      toast.success(`Category "${categoryToDelete}" deleted successfully`);
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
      setIsDeleting2(false);
    }
  };
  if (allCategories.length === 0) {
    return <p className="text-center py-4 text-sm text-gray-500">No items available</p>;
  }
  return <div className="space-y-6">
    {allCategories.map(category => <div key={category} className="space-y-2 border border-dashed border-gray-300 rounded-md p-2 my-[2px]">
      <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-md px-0 py-0">
        <h3 className="border border-slate-400 rounded ml-3 text-xs font-semibold my-0 text-slate-600 py-[4px] px-[12px] mx-0">
          {category}
        </h3>
        
        {category !== 'Uncategorized' && <div className="flex items-center space-x-1">
          <button onClick={() => handleEditCategory(category)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" title={`Edit ${category} category`}>
            <Edit className="h-3.5 w-3.5 text-gray-500" />
            <span className="sr-only">Edit category</span>
          </button>
          <button onClick={() => handleDeleteCategory(category)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" title={`Delete ${category} category`}>
            <Trash2 className="h-3.5 w-3.5 text-gray-500" />
            <span className="sr-only">Delete category</span>
          </button>
        </div>}
      </div>
      
      <div className="space-y-2 ml-3 mr-3 my-0 mx-0">
        {categorizedItems[category].map(item => <div key={item.id} className="flex items-start bg-white border rounded-md p-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.label} <span className="text-xs text-gray-500">({item.value})</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => onEdit(item)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" title={`Edit ${item.label}`}>
              <Edit className="h-3.5 w-3.5 text-gray-500" />
              <span className="sr-only">Edit</span>
            </button>
            <button onClick={() => onDelete(item.id)} disabled={isDeleting} className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50" title={`Delete ${item.label}`}>
              <Trash2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>)}
      </div>
    </div>)}
    
    {selectedChoiceId && <CategoryManagerDialog open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen} choiceId={selectedChoiceId} choiceLabel={selectedChoiceLabel} />}
    
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{categoryToDelete}"? 
            This will remove the category from all menu items. The items themselves will not be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting2}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={e => {
            e.preventDefault();
            performDelete();
          }} disabled={isDeleting2} className="bg-red-500 hover:bg-red-600">
            {isDeleting2 ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </> : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
};
export default MenuItemsByCategory;