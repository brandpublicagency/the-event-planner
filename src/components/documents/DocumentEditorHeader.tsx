import React from 'react';
import { useState } from "react";
import { DocumentActions } from "./DocumentActions";
import { CategorySelector } from "./CategorySelector";
import { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useNavigate } from "react-router-dom";
import { SaveButton } from "@/components/ui/save-button";
import { Category } from "@/types/category";

interface DocumentEditorHeaderProps {
  document: Document;
  content?: string;
  printRef?: React.RefObject<HTMLDivElement>;
  onTitleChange?: (title: string) => void;
  selectedCategories?: Category[];
  setSelectedCategories?: (categories: Category[]) => void;
  isSaving?: boolean;
  handleSave?: () => Promise<void>;
  isLoadingDocumentCategories?: boolean;
  contentRef?: React.RefObject<HTMLDivElement>;
  documentCategories?: any[];
  categories?: any[];
  onCategoryChange?: (categoryId: string | null) => void;
}

export default function DocumentEditorHeader({
  document,
  content,
  printRef,
  onTitleChange,
  selectedCategories = [],
  isLoadingDocumentCategories = false,
  handleSave,
  isSaving = false,
  categories = [],
  onCategoryChange
}: DocumentEditorHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleCategoryChange = (categoryId: string | null) => {
    if (!document.id || !onCategoryChange) return;
    onCategoryChange(categoryId);
  };

  const handleDeleteConfirmed = () => {
    console.log("Document deleted, navigating to documents page");
    navigate("/documents");
  };
  
  // Get the first category ID from document if available
  const selectedCategoryId = 
    selectedCategories && selectedCategories.length > 0 
      ? selectedCategories[0].id 
      : document.category_ids && document.category_ids.length > 0 
        ? document.category_ids[0] 
        : null;
  
  return (
    <div className="flex items-center justify-between border-b border-black/25 px-4 py-2">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <CategorySelector 
          selectedCategory={selectedCategoryId}
          onChange={handleCategoryChange}
          placeholder="Select category"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {handleSave && (
          <SaveButton
            onClick={handleSave}
            disabled={isSaving}
            loadingText="Saving..."
            defaultText="Save"
            successText="Saved!"
            timeout={2000}
            size="sm"
            className="h-7 w-auto px-2 document-save-button bg-black text-white hover:bg-black/80"
            variant="secondary"
          />
        )}
        
        <DocumentActions 
          document={document}
          content={content}
          printRef={printRef}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
        
        <DocumentDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          documentId={document.id}
          documentTitle={document.title}
          onDocumentDeleted={handleDeleteConfirmed}
        />
      </div>
    </div>
  );
}
