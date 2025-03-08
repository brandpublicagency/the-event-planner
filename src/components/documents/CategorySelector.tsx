
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Tag, Loader2 } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string | null;
  onChange: (categoryId: string | null) => void;
  includeAllOption?: boolean;
  placeholder?: string;
}

export function CategorySelector({ 
  selectedCategory, 
  onChange, 
  includeAllOption = false,
  placeholder = "Select category" 
}: CategorySelectorProps) {
  const { categories, isLoadingCategories } = useCategories();

  return (
    <Select 
      value={selectedCategory || ""}
      onValueChange={(value) => onChange(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-full h-9 bg-white">
        <div className="flex items-center gap-2">
          {isLoadingCategories ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">All Documents</SelectItem>
        )}
        {isLoadingCategories ? (
          <SelectItem value="loading" disabled>
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Loading categories...</span>
            </div>
          </SelectItem>
        ) : categories.length === 0 ? (
          <SelectItem value="none" disabled>No categories found</SelectItem>
        ) : (
          categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" 
                  style={{ backgroundColor: category.color || undefined }} />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
