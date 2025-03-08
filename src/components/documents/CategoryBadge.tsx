
import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { Category } from '@/types/category';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ 
  category,
  className = ""
}: CategoryBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={`mr-1 mb-1 ${className}`}
    >
      {category.name}
    </Badge>
  );
}
