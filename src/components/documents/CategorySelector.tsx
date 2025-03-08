
import React, { useState, useRef } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./CategoryBadge";
import { useCategories } from "@/hooks/useCategories";
import { Tag, Plus, X, Settings } from "lucide-react";
import type { Category } from '@/types/category';

interface CategorySelectorProps {
  selectedCategories: Category[];
  onChange: (categories: Category[]) => void;
}

export function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const { categories, isLoadingCategories, createCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectCategory = (category: Category) => {
    const isSelected = selectedCategories.some(c => c.id === category.id);
    
    if (isSelected) {
      onChange(selectedCategories.filter(c => c.id !== category.id));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      // Generate a random color
      const colors = [
        '#0284c7', '#7c3aed', '#dc2626', '#16a34a', '#fb923c', 
        '#a855f7', '#ec4899', '#4f46e5', '#0ea5e9', '#8b5cf6'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      createCategory({ name: newCategoryName.trim(), color: randomColor });
      setNewCategoryName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateCategory();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        
        <div className="flex items-center mb-3">
          <Input
            ref={inputRef}
            placeholder="Add new category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm h-8"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="ml-2 h-8 w-8 p-0"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-48 overflow-y-auto mb-2">
          {isLoadingCategories ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              No categories found. Create your first one!
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
