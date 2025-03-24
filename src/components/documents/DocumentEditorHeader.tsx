import { Loader2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentActions } from "./DocumentActions";
import { CategorySelector } from "./CategorySelector";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import type { Document } from "@/types/document";
import { isDocumentContent } from "@/types/document";

interface DocumentEditorHeaderProps {
  document: Document | null;
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  isLoadingDocumentCategories: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  documentCategories: any[];
  categories: Category[] | undefined;
}

export function DocumentEditorHeader({
  document,
  selectedCategories,
  setSelectedCategories,
  isSaving,
  handleSave,
  isLoadingDocumentCategories,
  contentRef,
  documentCategories,
  categories
}: DocumentEditorHeaderProps) {
  
  const handleCategoryChange = (categoryId: string | null) => {
    if (!categoryId || !categories) return;
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    const isAlreadySelected = selectedCategories.some(c => c.id === category.id);
    if (isAlreadySelected) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== categoryId));
  };

  const documentHtmlContent = document && isDocumentContent(document.content) 
    ? document.content.html 
    : '';

  return (
    <div className="flex justify-between items-center p-6 pb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="w-full md:w-64">
          {!isLoadingDocumentCategories && <CategorySelector selectedCategory={null} onChange={handleCategoryChange} placeholder="Add category" />}
        </div>
        
        {selectedCategories.length > 0 && <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => <Badge key={category.id} variant="outline" className="flex items-center gap-1">
                <span className="font-light text-xs text-gray-500">{category.name}</span>
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 hover:bg-transparent" onClick={() => removeCategory(category.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>)}
          </div>}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="flex items-center gap-1.5 h-7 px-2 min-w-[60px] bg-zinc-900 text-white hover:bg-zinc-700"
        >
          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        {document && (
          <DocumentActions 
            document={document}
            content={documentHtmlContent}
            printRef={contentRef}
          />
        )}
      </div>
    </div>
  );
}
