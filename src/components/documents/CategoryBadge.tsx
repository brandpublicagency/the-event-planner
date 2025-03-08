
import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { Category } from '@/types/category';

interface CategoryBadgeProps {
  category: Category;
  onClick?: () => void;
  selected?: boolean;
  showClose?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function CategoryBadge({ 
  category, 
  onClick, 
  selected = false, 
  showClose = false, 
  onRemove,
  className = ""
}: CategoryBadgeProps) {
  const style = {
    backgroundColor: selected ? category.color || '#e5e7eb' : 'transparent',
    borderColor: category.color || '#e5e7eb',
    color: selected ? 'white' : (category.color || '#4b5563'),
  };

  return (
    <Badge 
      variant="outline"
      className={`mr-1 mb-1 cursor-pointer ${className}`}
      style={style}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {category.name}
      {showClose && (
        <span 
          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
        >
          &times;
        </span>
      )}
    </Badge>
  );
}
