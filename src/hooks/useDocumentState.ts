
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import type { DocumentContent } from "@/types/document";
import { isDocumentContent } from "@/types/document";

// Define the interface for saveDocument parameters
interface SaveDocumentOptions {
  title?: string;
  content?: string;
  whiteboard?: string;
  showToast?: boolean;
}

export function useDocumentState(documentId: string | null, editor: Editor | null, isAuthenticated: boolean) {
  const [isSaving, setIsSaving] = useState(false);
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);
  const [contentSet, setContentSet] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  // Track when the editor is ready for content
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setEditorReady(true);
    } else {
      setEditorReady(false);
    }
  }, [editor]);

  // Reset contentSet when document changes
  useEffect(() => {
    if (documentId) {
      setContentSet(false);
    }
  }, [documentId]);

  // Load initial document content
  useEffect(() => {
    if (!editorReady || !document?.content || contentSet) return;
    try {
      if (isDocumentContent(document.content)) {
        editor?.commands.setContent(document.content.html || '');
        setContentSet(true);
      } else {
        console.warn("Invalid document content format:", document.content);
      }
    } catch (err) {
      console.error("Error setting document content:", err);
    }
  }, [document, editorReady, editor, contentSet]);

  const saveDocument = async (options: SaveDocumentOptions = {}) => {
    const { title, content: contentOverride, showToast = true } = options;
    
    if (!editor && !contentOverride || !documentId) {
      return;
    }

    const currentContent = contentOverride || editor?.getHTML() || '';

    const content: DocumentContent = {
      type: "doc",
      html: currentContent,
      text: editor ? editor.getText() : '',
    };

    if (options.whiteboard !== undefined) {
      content.whiteboard = options.whiteboard;
    } else if (document && isDocumentContent(document.content) && document.content.whiteboard) {
      content.whiteboard = document.content.whiteboard;
    }

    setIsSaving(true);
    try {
      const updateParams: any = { 
        content: content,
        showToast
      };
      if (title !== undefined) {
        updateParams.title = title;
      }
      await updateDocument.mutateAsync(updateParams);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    document,
    isLoading,
    error,
    saveDocument,
    isSaving,
    contentSet
  };
}
