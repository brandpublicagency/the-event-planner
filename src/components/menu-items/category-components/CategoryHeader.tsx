
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryHeaderProps {
  category: string;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  dragHandleProps?: any; // Keep for backward compatibility
  showDragHandle?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
  showDragHandle = false // Default to false to hide drag handles
}) => {
  const isUncategorized = category === 'Uncategorized' || category === 'Items';
  
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center">
        <h3 className="text-md font-semibold">{category}</h3>
      </div>
      
      {!isUncategorized && (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditCategory(category)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {category}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteCategory(category)}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {category}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
