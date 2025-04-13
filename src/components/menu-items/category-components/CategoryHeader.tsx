
import React from 'react';
import { GripVertical } from 'lucide-react';
import CategoryLabel from './CategoryLabel';
import CategoryActions from './CategoryActions';

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
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center">
        {showDragHandle && dragHandleProps && (
          <div {...dragHandleProps} className="cursor-grab mr-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <CategoryLabel category={category} />
      </div>
      
      <CategoryActions
        category={category}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};

export default CategoryHeader;
