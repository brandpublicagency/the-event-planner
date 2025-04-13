
import React from 'react';
import MenuItemCard from './MenuItemCard';
import { MenuItem } from '@/api/types/menuItems';

interface CategoryItemsDroppableProps {
  category: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const CategoryItemsDroppable: React.FC<CategoryItemsDroppableProps> = ({
  category,
  items,
  onEdit,
  onDelete,
  isDeleting
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
        />
      ))}
    </div>
  );
};

export default CategoryItemsDroppable;
