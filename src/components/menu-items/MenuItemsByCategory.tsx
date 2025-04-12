
import React, { useMemo, useEffect } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
    
    // Open the category manager with this category pre-selected for editing
    // This requires integration with CategoryManager component
    // For now, we'll just show a toast
    toast.info(`Edit category: ${category} (Implementation pending)`);
    
    // In a real implementation, you would:
    // 1. Set a state variable with the category to edit
    // 2. Open a modal or dialog to edit the category
    // 3. Send the update to the backend
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
    
    // Confirm deletion with the user
    // For now, we'll just show a toast
    toast.info(`Delete category: ${category} (Implementation pending)`);
    
    // In a real implementation, you would:
    // 1. Show a confirmation dialog
    // 2. Send a delete request to the backend
    // 3. Update all items in this category to have no category
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
                  <Edit className="h-3.5 w-3.5 text-blue-500" />
                  <span className="sr-only">Edit category</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  title={`Delete ${category} category`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
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
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting}
                    className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemsByCategory;
