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
  return;
}