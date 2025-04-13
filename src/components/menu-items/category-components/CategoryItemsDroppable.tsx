
import React from 'react';
import MenuItemCard from './MenuItemCard';

interface CategoryItemsDroppableProps {
  category: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  canReorder?: boolean;
}

const CategoryItemsDroppable: React.FC<CategoryItemsDroppableProps> = ({
  category,
  items,
  onEdit,
  onDelete,
  isDeleting,
  canReorder = false
}) => {
  return (
    <div className="space-y-2 mx-[6px] my-0 py-0">
      {items.map((item, index) => (
        <MenuItemCard
          key={item.id}
          item={item}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isDragDisabled={true}
        />
      ))}
    </div>
  );
};

export default CategoryItemsDroppable;
