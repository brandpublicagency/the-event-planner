
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
  showDragHandle = false
}) => {
  // For regular categories, maintain the existing container style
  if (!isBuffetCategory) {
    return (
      <div className="space-y-2 border border-dashed border-gray-300 rounded-md p-3 px-[2px] py-[10px] my-[4px]">
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
  }
  
  // For buffet categories, render without the outer container
  return (
    <div className="space-y-2 border border-dashed border-gray-300 rounded-md p-3 px-[2px] py-[10px] my-[4px]">
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
