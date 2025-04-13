
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
  isBuffetCategory?: boolean;
  isGroupedLayout?: boolean;
  noBorder?: boolean;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  category,
  items,
  onEdit,
  onDelete,
  isDeleting,
  onEditCategory,
  onDeleteCategory,
  isBuffetCategory = false,
  isGroupedLayout = false,
  noBorder = false
}) => {
  const containerClasses = noBorder
    ? "space-y-2 py-[10px] my-[4px]"
    : "space-y-2 py-[10px] my-[4px]";
  
  return (
    <div className={containerClasses}>
      <CategoryHeader 
        category={category}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
      
      <CategoryItemsDroppable
        category={category}
        items={items}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CategoryContainer;
