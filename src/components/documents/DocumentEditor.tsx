import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DocumentContent } from "./DocumentContent";
import { DocumentTitle } from "./DocumentTitle";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useToast } from "@/components/ui/use-toast";
import type { DocumentContent as DocumentContentType } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const isAuthenticated = useDocumentAuth();
  const lastSavedContent = useRef<string>("");
  const titleTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  });

  // Save document when unmounting or changing documents
  useEffect(() => {
    if (!editor || !documentId || !isAuthenticated) return;

    const saveDocument = async () => {
      const currentContent = editor.getHTML();
      if (!currentContent || currentContent === lastSavedContent.current) return;

      try {
        const content: DocumentContentType = {
          type: "doc",
          html: currentContent,
          text: editor.getText(),
        };

        await updateDocument.mutateAsync({ content });
        lastSavedContent.current = currentContent;
      } catch (error) {
        console.error('Error saving document:', error);
        toast({
          title: "Error saving document",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive",
        });
      }
    };

    return () => {
      saveDocument();
    };
  }, [documentId, editor, isAuthenticated, updateDocument, toast]);

  // Load initial document content
  useEffect(() => {
    if (!editor || !document?.content || editor.isDestroyed) return;

    const docContent = document.content as DocumentContentType;
    if (docContent?.html && docContent.html !== lastSavedContent.current) {
      editor.commands.setContent(docContent.html);
      lastSavedContent.current = docContent.html;
    }
  }, [document?.content, editor]);

  // Update title state when document changes
  useEffect(() => {
    if (!document?.title) return;
    if (document.title !== title) {
      setTitle(document.title);
    }
  }, [document?.title]);

  // Handle title updates with debounce
  useEffect(() => {
    if (!documentId || !isAuthenticated || !title || title === document?.title) return;

    // Clear any existing timeout
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }

    titleTimeoutRef.current = setTimeout(() => {
      updateDocument.mutate({ title });
    }, 500);

    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
    };
  }, [title, documentId, document?.title, isAuthenticated, updateDocument]);

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
      <DocumentTitle
        title={title}
        onTitleChange={setTitle}
        documentId={documentId}
        editor={editor}
      />
      <DocumentContent editor={editor} />
    </div>
  );
}