
import { useEditor } from '@tiptap/react';
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentState } from "@/hooks/useDocumentState";
import { CategorySelector } from "./CategorySelector";
import { useDocumentCategories, useCategories } from "@/hooks/useCategories";
import { useEffect, useState, useRef, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DocumentActions } from "./DocumentActions";
import type { Category } from "@/types/category";
import { isDocumentContent } from "@/types/document";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({
  documentId
}: DocumentEditorProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useDocumentAuth();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Create editor with useMemo to prevent recreation on rerenders
  const editor = useEditor({
    extensions: useMemo(() => getEditorExtensions(), []),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none'
      }
    }
  });
  
  const {
    document,
    isLoading,
    error,
    saveDocument,
    isSaving
  } = useDocumentState(documentId, editor, isAuthenticated);
  
  const {
    categories
  } = useCategories();
  
  const {
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories
  } = useDocumentCategories(documentId);

  // Update selectedCategories when documentCategories or categories change
  useEffect(() => {
    if (!documentCategories || !categories) return;
    
    const selected = documentCategories.map(docCat => {
      const fullCategory = categories.find(c => c.id === docCat.id);
      return fullCategory || docCat;
    });
    
    setSelectedCategories(selected);
  }, [documentCategories, categories]);

  const handleSave = async () => {
    try {
      await saveDocument({
        showToast: false
      });
      
      if (documentId) {
        await updateDocumentCategories({
          documentId,
          categoryIds: selectedCategories.map(c => c.id),
          showSuccessToast: true
        });
      }
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

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
    setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
  };

  const goToLogin = () => {
    navigate("/login", { state: { from: "/documents" } });
  };

  if (isAuthLoading) {
    return <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">Authentication required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to view and edit documents.
          </p>
          <Button onClick={goToLogin}>
            Go to Login
          </Button>
        </div>
      </div>;
  }

  if (!documentId) {
    return <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">No document selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a document from the list or create a new one to start editing.
          </p>
        </div>
      </div>;
  }

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>;
  }

  if (error || !document) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">
        {error ? `Error: ${error.message}` : "Document not found"}
      </div>;
  }

  const documentHtmlContent = isDocumentContent(document.content) 
    ? document.content.html 
    : '';

  return (
    <div className="h-full flex flex-col">
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
            className="flex items-center gap-1.5 h-7 px-2 min-w-[60px] bg-white border border-zinc-300"
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
      <div className="flex-1 px-6 pb-6 flex flex-col overflow-hidden">
        <DocumentContent editor={editor} ref={contentRef} />
      </div>
    </div>
  );
}
