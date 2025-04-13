
import React from 'react';

interface CategoryLabelProps {
  category: string;
}

const CategoryLabel: React.FC<CategoryLabelProps> = ({ category }) => {
  return (
    <h3 className="border border-slate-400 rounded ml-[6px] text-xs font-semibold text-slate-600 py-[4px] px-[12px] my-[4px] mx-[4px]">
      {category}
    </h3>
  );
};

export default CategoryLabel;
