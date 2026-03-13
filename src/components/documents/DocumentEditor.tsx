
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
import { BubbleToolbar } from "./BubbleToolbar";
import { KeyboardShortcutsOverlay } from "./KeyboardShortcutsOverlay";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({
  documentId
}: DocumentEditorProps) {
  const { isAuthenticated } = useDocumentAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [localTitle, setLocalTitle] = useState("");
  const navigate = useNavigate();
  
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
    setLocalTitle(e.target.value);
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

  if (!documentId) return <DocumentEditorEmpty />;
  if (isLoading) return <DocumentEditorLoading />;
  if (error || !document) return <DocumentEditorError error={error} />;

  const selectedCategoryId =
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories[0].id
      : document.category_ids && document.category_ids.length > 0
        ? document.category_ids[0]
        : null;

  return (
    <div className="h-full flex flex-col">
      <Header pageTitle="Documents">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/documents")}>
            <ArrowLeft className="h-4 w-4" />
            Library
          </Button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <CategorySelector
            selectedCategory={selectedCategoryId}
            onChange={(categoryId) => document.id && handleUpdateCategories(categoryId)}
            placeholder="Category"
            className="w-[140px]"
          />
          <SaveButton
            onClick={handleSave}
            disabled={isSaving}
            loadingText="Saving..."
            defaultText="Save"
            successText="Saved!"
            timeout={2000}
            size="sm"
            className="h-7 text-[11px] px-2 bg-foreground text-background hover:bg-foreground/90"
            variant="secondary"
          />
          <DocumentActions
            document={document}
            content={editor?.getHTML()}
            printRef={contentRef}
            onDelete={() => {}}
          />
        </div>
      </Header>

      {/* Editor toolbar */}
      <div className="px-4 pt-2 shrink-0">
        <EditorToolbar editor={editor} />
      </div>

      {/* Bubble toolbar for text selection */}
      {editor && <BubbleToolbar editor={editor} />}

      {/* Inline title + content — full width */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <input
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className="w-full text-2xl font-semibold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-1"
          />
          <div className="h-px bg-border/50 mb-4" />
          <DocumentContent editor={editor} ref={contentRef} />
        </div>
      </div>
    </div>
  );
}
