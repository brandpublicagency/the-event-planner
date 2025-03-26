
import { useEditor } from '@tiptap/react';
import { useDocumentState } from "@/hooks/useDocumentState";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useEffect, useRef, useMemo } from "react";
import DocumentEditorHeader from "./DocumentEditorHeader";
import { DocumentEditorEmpty } from "./DocumentEditorEmpty";
import { DocumentEditorLoading } from "./DocumentEditorLoading";
import { DocumentEditorError } from "./DocumentEditorError";
import { useDocumentCategoriesState } from "@/hooks/useDocumentCategoriesState";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({
  documentId
}: DocumentEditorProps) {
  const { isAuthenticated } = useDocumentAuth();
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
    selectedCategories,
    setSelectedCategories,
    categories,
    documentCategories,
    isLoadingDocumentCategories,
    updateDocumentCategories
  } = useDocumentCategoriesState(documentId);

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

  // If no document is selected, show the empty state
  if (!documentId) {
    return <DocumentEditorEmpty />;
  }

  // If document is loading, show the loading state
  if (isLoading) {
    return <DocumentEditorLoading />;
  }

  // If there was an error or the document doesn't exist, show the error state
  if (error || !document) {
    return <DocumentEditorError error={error} />;
  }

  return (
    <div className="h-full flex flex-col">
      <DocumentEditorHeader
        document={document}
        selectedCategories={selectedCategories}
        onTitleChange={(title) => saveDocument({ title, showToast: false })}
        isSaving={isSaving}
        handleSave={handleSave}
        isLoadingDocumentCategories={isLoadingDocumentCategories}
        contentRef={contentRef}
        documentCategories={documentCategories}
        categories={categories}
        content={editor?.getHTML()}
        printRef={contentRef}
      />
      <div className="flex-1 px-6 pb-6 flex flex-col overflow-hidden">
        <DocumentContent editor={editor} ref={contentRef} />
      </div>
    </div>
  );
}
