
import { useEditor } from '@tiptap/react';
import { useDocumentState } from "@/hooks/useDocumentState";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { DocumentEditorEmpty } from "./DocumentEditorEmpty";
import { DocumentEditorLoading } from "./DocumentEditorLoading";
import { DocumentEditorError } from "./DocumentEditorError";
import { useDocumentCategoriesState } from "@/hooks/useDocumentCategoriesState";
import { DocumentActions } from "./DocumentActions";
import { CategorySelector } from "./CategorySelector";
import { SaveButton } from "@/components/ui/save-button";
import { EditorToolbar } from "./EditorToolbar";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({
  documentId
}: DocumentEditorProps) {
  const { isAuthenticated } = useDocumentAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [localTitle, setLocalTitle] = useState("");
  
  const editor = useEditor({
    extensions: useMemo(() => getEditorExtensions(), []),
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none'
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
    categories,
    documentCategories,
    isLoadingDocumentCategories,
    handleUpdateCategories
  } = useDocumentCategoriesState(documentId);

  // Sync local title with document title
  useEffect(() => {
    if (document?.title) {
      setLocalTitle(document.title);
    }
  }, [document?.title]);

  const handleSave = async () => {
    try {
      await saveDocument({ showToast: true });
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
  }, []);

  const handleTitleBlur = useCallback(() => {
    if (localTitle !== document?.title) {
      saveDocument({ title: localTitle, showToast: false });
    }
  }, [localTitle, document?.title, saveDocument]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus('start');
    }
  }, [editor]);

  if (!documentId) {
    return <DocumentEditorEmpty />;
  }

  if (isLoading) {
    return <DocumentEditorLoading />;
  }

  if (error || !document) {
    return <DocumentEditorError error={error} />;
  }

  const selectedCategoryId =
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories[0].id
      : document.category_ids && document.category_ids.length > 0
        ? document.category_ids[0]
        : null;

  return (
    <div className="h-full flex flex-col">
      {/* Minimal top bar: category + actions */}
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <CategorySelector
            selectedCategory={selectedCategoryId}
            onChange={(categoryId) => document.id && handleUpdateCategories(categoryId)}
            placeholder="Add category"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <SaveButton
            onClick={handleSave}
            disabled={isSaving}
            loadingText="Saving..."
            defaultText="Save"
            successText="Saved!"
            timeout={2000}
            size="sm"
            className="h-6 text-[11px] px-2 bg-foreground text-background hover:bg-foreground/90"
            variant="secondary"
          />
          <DocumentActions
            document={document}
            content={editor?.getHTML()}
            printRef={contentRef}
            onDelete={() => {}}
          />
        </div>
      </div>

      {/* Editor toolbar */}
      <div className="px-4 pt-2 shrink-0">
        <EditorToolbar editor={editor} />
      </div>

      {/* Inline title + content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-4">
          {/* Notion-style inline title */}
          <input
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className="w-full text-2xl font-semibold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-1"
          />
          <div className="h-px bg-border/50 mb-4" />

          {/* Document content */}
          <DocumentContent editor={editor} ref={contentRef} />
        </div>
      </div>
    </div>
  );
}
