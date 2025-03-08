
import React from 'react';
import { useCategories } from "@/hooks/useCategories";
import { CategoryBadge } from "./CategoryBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function CategoryManager() {
  const { categories, isLoadingCategories } = useCategories();

  if (isLoadingCategories) {
    return <div className="py-4">Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          These are the predefined categories available for organizing documents.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 gap-2">
        <h3 className="text-sm font-medium">Available Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <CategoryBadge
              key={category.id}
              category={category}
              selected={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
