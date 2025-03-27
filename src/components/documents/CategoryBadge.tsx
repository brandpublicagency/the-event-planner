
import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { Category } from '@/types/category';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  selected?: boolean;
}

export function CategoryBadge({
  category,
  className = "",
  selected = false
}: CategoryBadgeProps) {
  // Generate a color style based on the category's color
  const style = category.color 
    ? { backgroundColor: category.color } 
    : undefined;
  
  return (
    <Badge
      variant={selected ? "default" : "outline"}
      className={`${className} text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors`}
      style={style}
    >
      {category.name}
    </Badge>
  );
}
