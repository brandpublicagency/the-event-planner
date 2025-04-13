
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import MenuItemCard from './MenuItemCard';

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
    <div className="space-y-2">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-2 text-sm text-gray-500 italic">
          No items in this category
        </div>
      )}
    </div>
  );
};

export default CategoryItemsDroppable;
