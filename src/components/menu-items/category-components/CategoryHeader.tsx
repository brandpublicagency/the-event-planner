
import React from 'react';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryLabel from './CategoryLabel';

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
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        {showDragHandle && dragHandleProps && (
          <div {...dragHandleProps} className="cursor-move px-1">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <CategoryLabel category={category} />
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditCategory(category)}
          className="h-7 w-7"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        
        {category !== 'Uncategorized' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteCategory(category)}
            className="h-7 w-7 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
