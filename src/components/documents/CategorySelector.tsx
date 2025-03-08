
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./CategoryBadge";
import { useCategories } from "@/hooks/useCategories";
import { Tag } from "lucide-react";
import type { Category } from '@/types/category';

interface CategorySelectorProps {
  selectedCategories: Category[];
  onChange: (categories: Category[]) => void;
}

export function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const { categories, isLoadingCategories } = useCategories();

  const handleSelectCategory = (category: Category) => {
    const isSelected = selectedCategories.some(c => c.id === category.id);
    
    if (isSelected) {
      onChange(selectedCategories.filter(c => c.id !== category.id));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Tag className="h-4 w-4" />
          <span>Categories</span>
          {selectedCategories.length > 0 && (
            <span className="bg-zinc-100 text-zinc-900 rounded-full px-2 py-0.5 text-xs">
              {selectedCategories.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="end">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Document Categories</h4>
        </div>
        
        <div className="max-h-48 overflow-y-auto mb-2">
          {isLoadingCategories ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {categories.map(category => (
                <CategoryBadge
                  key={category.id}
                  category={category}
                  selected={selectedCategories.some(c => c.id === category.id)}
                  onClick={() => handleSelectCategory(category)}
                />
              ))}
            </div>
          )}
        </div>
        
        {selectedCategories.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <h4 className="text-xs font-medium mb-1 text-muted-foreground">Selected Categories:</h4>
            <div className="flex flex-wrap">
              {selectedCategories.map(category => (
                <CategoryBadge
                  key={category.id}
                  category={category}
                  selected={true}
                  showClose={true}
                  onRemove={() => handleSelectCategory(category)}
                />
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
