
import React from 'react';
import CategoryLabel from './CategoryLabel';
import CategoryActions from './CategoryActions';

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
        <CategoryLabel category={category} />
        <CategoryActions 
          category={category} 
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory} 
        />
      </div>
    </div>
  );
};

export default CategoryHeader;
