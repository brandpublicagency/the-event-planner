
import React, { useEffect } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import CategoryContainer from '../category-components/CategoryContainer';
import AddItemButton from '../category-components/AddItemButton';
import { toast } from 'sonner';

interface BuffetMenuContainerProps {
  categories: string[];
  categorizedItems: Record<string, MenuItem[]>;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddItem?: (category: string | null) => void;
  handleDragEnd: (result: any) => void; // Keep for backward compatibility
}

const BuffetMenuContainer: React.FC<BuffetMenuContainerProps> = ({
  categories,
  categorizedItems,
  onEdit,
  onDelete,
  isDeleting,
  onEditCategory,
  onDeleteCategory,
  onAddItem
}) => {
  // Check if this is a sec-mains menu by looking at any item's choice value
  // Use case-insensitive comparison to handle various formats
  const isSecMains = Object.values(categorizedItems).some(items => 
    items.some(item => {
      const choice = item?.choice?.toLowerCase?.() || '';
      return choice.includes('sec') && choice.includes('main');
    })
  );

  console.log('BuffetMenuContainer: categories=', categories);
  
  return (
    <div className="border border-gray-300 rounded-md p-4">
      <div className="space-y-6">
        {categories.map((category) => (
          <div 
            key={`category-${category}`}
            className="bg-gray-50 rounded-md border border-gray-200 transition-all duration-200"
          >
            <CategoryContainer
              key={`category-container-${category}`}
              category={category}
              items={categorizedItems[category] || []}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              canReorder={!!onAddItem}
              isBuffetCategory={true}
              showDragHandle={false}
              noBorder={true}
            />
          </div>
        ))}
      </div>
      
      {/* Single Add Item button at the bottom of the container */}
      {onAddItem && (
        <div className="mt-4">
          <AddItemButton 
            onAddItem={onAddItem} 
            category={null} 
          />
        </div>
      )}
    </div>
  );
};

export default BuffetMenuContainer;
