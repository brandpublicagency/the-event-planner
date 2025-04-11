
import React, { useMemo } from 'react';
import { MenuItem } from '@/api/menuItemsApi';

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
  // Group items by category
  const categorizedItems = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    // First, handle items with no category
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      grouped['Uncategorized'] = uncategorizedItems;
    }
    
    // Then group items by their categories
    items.forEach(item => {
      if (item.category) {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      }
    });
    
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
    return categories;
  }, [categorizedItems]);

  if (allCategories.length === 0) {
    return <p className="text-center py-4 text-sm text-gray-500">No items available</p>;
  }

  return (
    <div className="space-y-6">
      {allCategories.map(category => (
        <div key={category} className="space-y-2">
          <h3 className="font-medium text-sm text-zinc-900 mb-2">{category}</h3>
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
