
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
  return (
    <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-md px-0 py-0">
      <h3 className="border border-slate-400 rounded ml-3 text-xs font-semibold my-0 text-slate-600 py-[4px] px-[12px] mx-[8px]">
        {category}
      </h3>
      
      {category !== 'Uncategorized' && (
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => onEditCategory(category)} 
            className="p-1 rounded-md hover:bg-gray-100 transition-colors" 
            title={`Edit ${category} category`}
          >
            <Edit className="h-3.5 w-3.5 text-gray-500" />
            <span className="sr-only">Edit category</span>
          </button>
          <button 
            onClick={() => onDeleteCategory(category)} 
            className="p-1 rounded-md hover:bg-gray-100 transition-colors" 
            title={`Delete ${category} category`}
          >
            <Trash2 className="h-3.5 w-3.5 text-gray-500" />
            <span className="sr-only">Delete category</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
