
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryHeaderProps {
  category: string;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  onEditCategory,
  onDeleteCategory
}) => {
  // Don't show any actions for uncategorized items
  if (category === 'Uncategorized' || category === 'Items') {
    return null;
  }

  return (
    <div className="mb-1 px-1 flex items-center justify-between">
      <div className="inline-flex items-center border border-zinc-800 text-xs font-semibold py-[8px] px-[14px] rounded-lg bg-transparent my-[8px]">
        {category}
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onEditCategory(category)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          title={`Edit ${category}`}
        >
          <Edit className="h-3.5 w-3.5 text-gray-500" />
        </button>
        <button
          onClick={() => onDeleteCategory(category)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          title={`Delete ${category}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;
