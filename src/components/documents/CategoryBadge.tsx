
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
  // Use monochromatic styling regardless of category color
  const style = selected 
    ? { backgroundColor: '#e5e7eb', color: '#374151' } 
    : { backgroundColor: 'transparent', borderColor: '#e5e7eb', color: '#6b7280' };

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
          className="ml-1.5 hover:bg-muted rounded-full p-0.5 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </Badge>
  );
}
