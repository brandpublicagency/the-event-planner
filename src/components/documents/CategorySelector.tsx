
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Tag } from "lucide-react";

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
      <SelectTrigger className="w-full h-9">
        <div className="flex items-center">
          <Tag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">All Documents</SelectItem>
        )}
        {isLoadingCategories ? (
          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
        ) : categories.length === 0 ? (
          <SelectItem value="none" disabled>No categories found</SelectItem>
        ) : (
          categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
