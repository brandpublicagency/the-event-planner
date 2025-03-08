
import { useEditor } from '@tiptap/react';
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentState } from "@/hooks/useDocumentState";
import { CategorySelector } from "./CategorySelector";
import { useDocumentCategories, useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";
import type { Category } from "@/types/category";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const isAuthenticated = useDocumentAuth();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  });

  const { document, isLoading, error, saveDocument, isSaving } = useDocumentState(documentId, editor, isAuthenticated);
  const { categories } = useCategories();
  const { 
    documentCategories, 
    isLoadingDocumentCategories,
    updateDocumentCategories 
  } = useDocumentCategories(documentId);

  // Update selected categories when document categories load or change
  useEffect(() => {
    if (!documentCategories || !categories || categories.length === 0) return;
    
    const selected = documentCategories.map(docCat => {
      // Find the full category object including color
      const fullCategory = categories.find(c => c.id === docCat.id);
      return fullCategory || docCat;
    });
    
    // Use JSON stringify comparison to prevent unnecessary state updates
    if (JSON.stringify(selected) !== JSON.stringify(selectedCategories)) {
      setSelectedCategories(selected);
    }
  }, [documentCategories, categories]);

  const handleSave = async () => {
    // First save the document content
    await saveDocument();
    
    // Then update categories if we have a document ID
    if (documentId) {
      updateDocumentCategories({
        documentId, 
        categoryIds: selectedCategories.map(c => c.id)
      });
    }
  };

  // Handler for category selection in document editor
  const handleCategoriesChange = (categoryId: string | null) => {
    if (!categoryId || !categories) return;
    
    // Find the category
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Check if this category is already selected
    const isAlreadySelected = selectedCategories.some(c => c.id === category.id);
    
    // Toggle the category
    if (isAlreadySelected) {
      // Remove it
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      // Add it
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a document to edit
      </div>
    );
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        {error ? `Error: ${error.message}` : "Document not found"}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          {!isLoadingDocumentCategories && (
            <CategorySelector 
              selectedCategory={selectedCategories.length > 0 ? selectedCategories[0].id : null}
              onChange={handleCategoriesChange}
            />
          )}
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <DocumentContent editor={editor} />
    </div>
  );
}
