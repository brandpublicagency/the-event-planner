import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import type { DocumentContent } from "@/types/document";
import { isDocumentContent } from "@/types/document";

export function useDocumentState(documentId: string | null, editor: Editor | null, isAuthenticated: boolean) {
  const lastSavedContent = useRef<string>("");
  const contentInitialized = useRef(false);
  const { toast } = useToast();
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);
  const [pendingContent, setPendingContent] = useState<DocumentContent | null>(null);
  const [lastToastTime, setLastToastTime] = useState(0);
  const TOAST_COOLDOWN = 2000; // 2 seconds between toasts

  // Debounce the content updates
  const debouncedContent = useDebounce(pendingContent, 1000);

  // Handle content updates from editor
  useEffect(() => {
    if (!editor || !isAuthenticated || !documentId) return;
    
    const handleUpdate = ({ editor }: { editor: Editor }) => {
      const currentContent = editor.getHTML();
      if (currentContent === lastSavedContent.current) return;

      const content: DocumentContent = {
        type: "doc",
        html: currentContent,
        text: editor.getText(),
      };

      setPendingContent(content);
      lastSavedContent.current = currentContent;
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [documentId, editor, isAuthenticated]);

  // Handle debounced content updates
  useEffect(() => {
    if (!debouncedContent || !documentId || !editor) return;

    const lines = debouncedContent.text.split('\n');
    const firstLine = lines[0] || 'Untitled Document';

    console.log("Saving document with content:", {
      title: firstLine,
      content: debouncedContent
    });

    const now = Date.now();
    if (now - lastToastTime >= TOAST_COOLDOWN) {
      toast({
        title: "Saving changes...",
        description: "Your document is being saved",
      });
      setLastToastTime(now);
    }

    updateDocument.mutate({ 
      title: firstLine,
      content: debouncedContent 
    });
  }, [debouncedContent, documentId, updateDocument, editor, toast, lastToastTime]);

  // Reset state when document changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    
    editor.commands.clearContent();
    lastSavedContent.current = "";
    contentInitialized.current = false;
    setPendingContent(null);
  }, [documentId, editor]);

  // Load initial document content
  useEffect(() => {
    if (!editor || !document?.content || editor.isDestroyed || contentInitialized.current) return;

    console.log("Loading initial document content:", document.content);

    if (isDocumentContent(document.content)) {
      try {
        const htmlContent = document.content.html || '';
        editor.commands.setContent(htmlContent);
        lastSavedContent.current = htmlContent;
        contentInitialized.current = true;
      } catch (err) {
        console.error("Error setting document content:", err);
        toast({
          title: "Error loading document",
          description: "There was an error loading the document content.",
          variant: "destructive",
        });
      }
    } else {
      console.warn("Invalid document content format:", document.content);
    }
  }, [document?.content, editor, toast]);

  return {
    document,
    isLoading,
    error,
    pendingContent
  };
}