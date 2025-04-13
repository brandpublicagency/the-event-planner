
import React, { useMemo, useEffect, useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CategoryManagerDialog from './CategoryManagerDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  
  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting2, setIsDeleting2] = useState(false);
  
  // Force a refresh of the menu items and categories when the component mounts
  useEffect(() => {
    // Invalidate cache to ensure we have the latest data with categories
    if (items.length > 0) {
      console.log("MenuItemsByCategory: Forcing refresh of menu items and categories");
      const choiceId = items[0].choice_id;
      queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
    }
  }, [items, queryClient]);
  
  // Group items by category
  const categorizedItems = useMemo(() => {
    console.log("Grouping items by category:", items);
    const grouped: Record<string, MenuItem[]> = {};
    
    // First, handle items with no category
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      grouped['Uncategorized'] = uncategorizedItems;
    }
    
    // Then group items by their categories
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
  
  // Get all categories in sorted order
  const allCategories = useMemo(() => {
    // Start with 'Uncategorized' if it exists, then add other categories alphabetically
    const categories = Object.keys(categorizedItems).sort();
    if (categories.includes('Uncategorized')) {
      return [
        'Uncategorized',
        ...categories.filter(c => c !== 'Uncategorized')
      ];
    }
    console.log("All categories detected:", categories);
    return categories;
  }, [categorizedItems]);

  const handleEditCategory = (category: string) => {
    if (category === 'Uncategorized') {
      toast.error('Cannot edit the Uncategorized category');
      return;
    }
    
    // Find the first item with this category to get the choice_id
    const itemInCategory = items.find(item => item.category === category);
    if (!itemInCategory || !itemInCategory.choice_id) {
      toast.error('Cannot determine choice for this category');
      return;
    }
    
    // Open the category manager
    setSelectedChoiceId(itemInCategory.choice_id);
    setSelectedChoiceLabel(itemInCategory.choice || 'Menu Items');
    setIsCategoryManagerOpen(true);
  };
  
  const handleDeleteCategory = (category: string) => {
    if (category === 'Uncategorized') {
      toast.error('Cannot delete the Uncategorized category');
      return;
    }
    
    // Find the first item with this category to get the choice_id
    const itemInCategory = items.find(item => item.category === category);
    if (!itemInCategory || !itemInCategory.choice_id) {
      toast.error('Cannot determine choice for this category');
      return;
    }
    
    // Set state for delete confirmation
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
      // Update all items in this category to have null category
      const { error } = await supabase
        .from('menu_items')
        .update({ category: null })
        .eq('category', categoryToDelete)
        .eq('choice_id', selectedChoiceId);
      
      if (error) throw error;
      
      toast.success(`Category "${categoryToDelete}" deleted successfully`);
      
      // Force refresh data
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', selectedChoiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', selectedChoiceId] });
      
      // Close dialog and reset state
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

  return (
    <div className="space-y-6">
      {allCategories.map(category => (
        <div key={category} className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm text-zinc-900">{category}</h3>
            
            {category !== 'Uncategorized' && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  title={`Edit ${category} category`}
                >
                  <Edit className="h-3.5 w-3.5 text-gray-500" />
                  <span className="sr-only">Edit category</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  title={`Delete ${category} category`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                  <span className="sr-only">Delete category</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="divide-y divide-gray-100 border rounded-md overflow-hidden">
            {categorizedItems[category].map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 bg-white hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.label} <span className="text-xs text-gray-500">({item.value})</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting}
                    className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Category Manager Dialog */}
      {selectedChoiceId && (
        <CategoryManagerDialog
          open={isCategoryManagerOpen}
          onOpenChange={setIsCategoryManagerOpen}
          choiceId={selectedChoiceId}
          choiceLabel={selectedChoiceLabel}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent dialog from closing automatically
                performDelete();
              }}
              disabled={isDeleting2}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting2 ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuItemsByCategory;
