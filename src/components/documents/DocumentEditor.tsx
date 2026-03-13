
import { useEditor } from '@tiptap/react';
import { useDocumentState } from "@/hooks/useDocumentState";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ImageUploadListener } from "./ImageUploadListener";
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
import { toast } from "sonner";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({
  documentId
}: DocumentEditorProps) {
  const { isAuthenticated } = useDocumentAuth();
  
  const [localTitle, setLocalTitle] = useState("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();
  const lastSavedContentRef = useRef<string>("");
  
  const editor = useEditor({
    extensions: useMemo(() => getEditorExtensions(), []),
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none'
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer) return false;
        const files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        files.forEach(async (file) => {
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            const { v4: uuid } = await import('uuid');
            const filePath = `document-images/${uuid()}-${file.name}`;
            const { data, error } = await supabase.storage
              .from('taskmanager-files')
              .upload(filePath, file);
            if (error) {
              console.error('Drop upload failed:', error);
              toast.error(`Upload failed: ${error.message}`);
              return;
            }
            const { data: urlData } = supabase.storage
              .from('taskmanager-files')
              .getPublicUrl(data.path);
            const node = view.state.schema.nodes.image.create({ src: urlData.publicUrl });
            const pos = coords?.pos ?? view.state.doc.content.size;
            view.dispatch(view.state.tr.insert(pos, node));
            toast.success("Image uploaded");
          } catch (err: any) {
            console.error('Drop image error:', err);
            toast.error(`Image upload failed: ${err?.message || 'Unknown error'}`);
          }
        });
        return true;
      },
      handlePaste: (view, event) => {
        if (!event.clipboardData) return false;
        const files = Array.from(event.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            const { v4: uuid } = await import('uuid');
            const filePath = `document-images/${uuid()}-${file.name}`;
            const { data, error } = await supabase.storage
              .from('taskmanager-files')
              .upload(filePath, file);
            if (error) {
              console.error('Paste upload failed:', error);
              toast.error(`Upload failed: ${error.message}`);
              return;
            }
            const { data: urlData } = supabase.storage
              .from('taskmanager-files')
              .getPublicUrl(data.path);
            const node = view.state.schema.nodes.image.create({ src: urlData.publicUrl });
            const pos = view.state.selection.anchor;
            view.dispatch(view.state.tr.insert(pos, node));
            toast.success("Image uploaded");
          } catch (err: any) {
            console.error('Paste image error:', err);
            toast.error(`Image upload failed: ${err?.message || 'Unknown error'}`);
          }
        });
        return true;
      },
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

  // Track last saved content for autosave change detection
  useEffect(() => {
    if (document?.content && typeof document.content === 'object' && 'html' in document.content) {
      lastSavedContentRef.current = (document.content as any).html || '';
    }
  }, [document?.content]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (!editor || !documentId) return;

    const interval = setInterval(() => {
      const currentHtml = editor.getHTML();
      if (currentHtml && currentHtml !== lastSavedContentRef.current) {
        lastSavedContentRef.current = currentHtml;
        saveDocument({ showToast: false });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, documentId, saveDocument]);

  // Cmd+S to save, Cmd+/ for shortcuts overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 's') {
        e.preventDefault();
        saveDocument({ showToast: true });
      }
      if (mod && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument]);

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
      <Header
        pageTitle="Documents"
        secondaryAction={
          <div className="flex items-center gap-2">
            <CategorySelector
              selectedCategory={selectedCategoryId}
              onChange={(categoryId) => document.id && handleUpdateCategories(categoryId)}
              placeholder="Category"
              className="w-[140px] h-9"
            />
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              loadingText="Saving..."
              defaultText="Save"
              successText="Saved!"
              timeout={2000}
              size="default"
              className="h-9"
            />
            <DocumentActions
              document={document}
              editor={editor}
              onDelete={() => {}}
            />
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground h-9" onClick={() => navigate("/documents")}>
            <ArrowLeft className="h-4 w-4" />
            Library
          </Button>
        </div>
      </Header>

      {/* Editor toolbar */}
      <div className="px-4 pt-2 shrink-0">
        <EditorToolbar editor={editor} />
      </div>

      {/* Bubble toolbar for text selection */}
      {editor && <BubbleToolbar editor={editor} />}
      {editor && <ImageUploadListener editor={editor} />}

      {/* Inline title + content — full width */}
      <div
        className="flex-1 overflow-auto cursor-text"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            editor?.commands.focus('end');
          }
        }}
      >
        <div
          className="px-6 py-4 flex flex-col min-h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              editor?.commands.focus('end');
            }
          }}
        >
          <input
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className="w-full text-2xl font-semibold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-1 cursor-text"
          />
          <div className="h-px bg-border/50 mb-4" />
          <DocumentContent editor={editor} />
        </div>
      </div>

      <KeyboardShortcutsOverlay open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
