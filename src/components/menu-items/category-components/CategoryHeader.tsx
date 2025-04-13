
import React from 'react';
import CategoryLabel from './CategoryLabel';
import CategoryActions from './CategoryActions';
import { GripVertical } from 'lucide-react';

interface CategoryHeaderProps {
  category: string;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  dragHandleProps?: any;
  showDragHandle?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
  dragHandleProps,
  showDragHandle = false
}) => {
  return (
    <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-md px-0 py-0 mx-[3px] my-[4px]">
      <div className="flex items-center">
        <CategoryLabel category={category} />
        <CategoryActions 
          category={category} 
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory} 
        />
      </div>
      
      {showDragHandle && dragHandleProps && category !== 'Uncategorized' && (
        <div 
          {...dragHandleProps} 
          className="cursor-grab opacity-40 hover:opacity-100 pr-2"
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
