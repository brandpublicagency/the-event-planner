import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useToast } from "@/components/ui/use-toast";
import type { DocumentContent as DocumentContentType } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const isAuthenticated = useDocumentAuth();
  const lastSavedContent = useRef<string>("");
  const contentInitialized = useRef(false);
  const { toast } = useToast();
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (!isAuthenticated) return;
      
      const lines = editor.getText().split('\n');
      const firstLine = lines[0] || 'Untitled Document';
      const currentContent = editor.getHTML();
      
      if (currentContent === lastSavedContent.current) return;

      const content: DocumentContentType = {
        type: "doc",
        html: currentContent,
        text: editor.getText(),
      };

      updateDocument.mutate({ 
        title: firstLine,
        content 
      }, {
        onError: (error) => {
          console.error('Error saving document:', error);
          toast({
            title: "Error saving document",
            description: "Failed to save your changes. Please try again.",
            variant: "destructive",
          });
        }
      });
      
      lastSavedContent.current = currentContent;
    },
  });

  // Reset state when document changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    
    editor.commands.clearContent();
    lastSavedContent.current = "";
    contentInitialized.current = false;
  }, [documentId, editor]);

  // Load initial document content
  useEffect(() => {
    if (!editor || !document?.content || editor.isDestroyed || contentInitialized.current) return;

    const docContent = document.content as DocumentContentType;
    if (docContent?.html) {
      editor.commands.setContent(docContent.html);
      lastSavedContent.current = docContent.html;
      contentInitialized.current = true;
    }
  }, [document?.content, editor]);

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