
import React from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import CategoryHeader from './CategoryHeader';
import CategoryItemsDroppable from './CategoryItemsDroppable';

interface CategoryContainerProps {
  category: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddItem?: (category: string | null) => void;
  canReorder?: boolean;
  isBuffetCategory?: boolean;
  showAddItemButton?: boolean;
  dragHandleProps?: any;
  showDragHandle?: boolean;
  isGroupedLayout?: boolean;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  category,
  items,
  onEdit,
  onDelete,
  isDeleting,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  canReorder = true,
  isBuffetCategory = false,
  showAddItemButton = true,
  dragHandleProps,
  showDragHandle = false,
  isGroupedLayout = false
}) => {
  // Use a conditional class for the container
  const containerClasses = isGroupedLayout
    ? "space-y-2 py-[10px] my-[4px]" // No border when in grouped layout
    : "space-y-2 border border-dashed border-gray-300 rounded-md p-3 px-[2px] py-[10px] my-[4px]"; // Keep border when standalone
  
  return (
    <div className={containerClasses}>
      <CategoryHeader 
        category={category}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
        dragHandleProps={dragHandleProps}
        showDragHandle={showDragHandle}
      />
      
      <CategoryItemsDroppable
        category={category}
        items={items}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
        onAddItem={onAddItem}
        canReorder={canReorder}
        showAddItemButton={showAddItemButton}
      />
    </div>
  );
};

export default CategoryContainer;
