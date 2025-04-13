
import React from 'react';

interface CategoryActionsProps {
  category: string;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({
  category,
  onEditCategory,
  onDeleteCategory
}) => {
  if (category === 'Uncategorized') {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2 ml-2">
      <button 
        onClick={() => onEditCategory(category)} 
        className="text-[10px] text-[#C8C8C9] hover:underline"
        title={`Edit ${category} category`}
      >
        Edit
      </button>
      <button 
        onClick={() => onDeleteCategory(category)} 
        className="text-[10px] text-[#C8C8C9] hover:underline"
        title={`Delete ${category} category`}
      >
        Delete
      </button>
    </div>
  );
};

export default CategoryActions;
