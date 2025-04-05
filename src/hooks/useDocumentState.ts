
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import type { DocumentContent } from "@/types/document";
import { isDocumentContent } from "@/types/document";

// Define the interface for saveDocument parameters
interface SaveDocumentOptions {
  title?: string;
  content?: string;
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

    console.log("Loading document content:", document.content);

    try {
      if (isDocumentContent(document.content)) {
        console.log("Setting editor content to:", document.content.html?.substring(0, 100));
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
      console.log("Cannot save: editor or documentId is missing");
      return;
    }

    const currentContent = contentOverride || editor?.getHTML() || '';
    const lines = editor ? editor.getText().split('\n') : [];
    const firstLine = title || lines[0] || 'Untitled Document';

    const content: DocumentContent = {
      type: "doc",
      html: currentContent,
      text: editor ? editor.getText() : '',
    };

    setIsSaving(true);
    try {
      await updateDocument.mutateAsync({ 
        title: firstLine,
        content: content,
        showToast 
      });
      console.log("Document saved successfully");
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
