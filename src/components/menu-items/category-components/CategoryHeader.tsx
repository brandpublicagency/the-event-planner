
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';

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
  const isUncategorized = category === 'Uncategorized' || category === 'Items';
  
  return (
    <div className="flex items-center justify-between px-1 py-1">
      <div className="flex items-center">
        {showDragHandle && (
          <div
            {...dragHandleProps}
            className="mr-2 cursor-grab active:cursor-grabbing"
            data-testid="category-drag-handle"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <h3 className="text-md font-medium">{category}</h3>
      </div>
      
      {!isUncategorized && (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditCategory(category)}
            className="h-7 w-7"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Edit {category}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteCategory(category)}
            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete {category}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
