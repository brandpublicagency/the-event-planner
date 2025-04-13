
import React from 'react';

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
    <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-md px-0 py-0 mx-[3px] my-[4px]">
      <div className="flex items-center">
        <h3 className="border border-slate-400 rounded ml-[6px] text-xs font-semibold text-slate-600 py-[4px] px-[12px] my-[4px] mx-[4px]">
          {category}
        </h3>
        
        {category !== 'Uncategorized' && (
          <div className="flex items-center space-x-2 ml-2">
            <button 
              onClick={() => onEditCategory(category)} 
              className="text-[10px] text-primary-purple hover:underline"
              title={`Edit ${category} category`}
            >
              Edit
            </button>
            <button 
              onClick={() => onDeleteCategory(category)} 
              className="text-[10px] text-red-500 hover:underline"
              title={`Delete ${category} category`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
