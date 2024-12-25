import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import type { DocumentContent } from "@/types/document";
import { isDocumentContent } from "@/types/document";

export function useDocumentState(documentId: string | null, editor: Editor | null, isAuthenticated: boolean) {
  const [isSaving, setIsSaving] = useState(false);
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  // Load initial document content
  useEffect(() => {
    if (!editor || !document?.content || editor.isDestroyed) return;

    console.log("Loading document content:", document.content);

    if (isDocumentContent(document.content)) {
      try {
        editor.commands.setContent(document.content.html || '');
      } catch (err) {
        console.error("Error setting document content:", err);
      }
    } else {
      console.warn("Invalid document content format:", document.content);
    }
  }, [document?.content, editor]);

  const saveDocument = async () => {
    if (!editor || !documentId) return;

    const currentContent = editor.getHTML();
    const lines = editor.getText().split('\n');
    const firstLine = lines[0] || 'Untitled Document';

    const content: DocumentContent = {
      type: "doc",
      html: currentContent,
      text: editor.getText(),
    };

    setIsSaving(true);
    try {
      await updateDocument.mutateAsync({ 
        title: firstLine,
        content: content 
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
    isSaving
  };
}