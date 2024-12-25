import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useToast } from "@/components/ui/use-toast";
import type { DocumentContent as DocumentContentType } from "@/types/document";
import { useDebounce } from "@/hooks/useDebounce";
import { isDocumentContent } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const isAuthenticated = useDocumentAuth();
  const lastSavedContent = useRef<string>("");
  const contentInitialized = useRef(false);
  const { toast } = useToast();
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);
  const [pendingContent, setPendingContent] = useState<DocumentContentType | null>(null);

  // Debounce the content updates
  const debouncedContent = useDebounce(pendingContent, 1000);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (!isAuthenticated || !documentId) return;
      
      const currentContent = editor.getHTML();
      if (currentContent === lastSavedContent.current) return;

      const content: DocumentContentType = {
        type: "doc",
        html: currentContent,
        text: editor.getText(),
      };

      setPendingContent(content);
      lastSavedContent.current = currentContent;
    },
  });

  // Handle debounced content updates
  useEffect(() => {
    if (!debouncedContent || !documentId || !editor) return;

    const lines = debouncedContent.text.split('\n');
    const firstLine = lines[0] || 'Untitled Document';

    console.log("Saving document with content:", {
      title: firstLine,
      content: debouncedContent
    });

    updateDocument.mutate({ 
      title: firstLine,
      content: debouncedContent 
    });
  }, [debouncedContent, documentId, updateDocument, editor]);

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
        // Ensure we're passing a valid HTML string
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
      <DocumentContent editor={editor} />
    </div>
  );
}