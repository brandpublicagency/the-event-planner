
import React from 'react';
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M18 8v8"></path>
            <path d="M6 8v8"></path>
            <path d="M12 4v16"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
