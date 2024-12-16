import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DocumentContent } from "./DocumentContent";
import { DocumentTitle } from "./DocumentTitle";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useToast } from "@/components/ui/use-toast";
import type { DocumentContent as DocumentContentType } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isAuthenticated = useDocumentAuth();
  const debouncedTitle = useDebounce(title, 1000);
  const lastSavedContent = useRef<string>("");
  const { toast } = useToast();

  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  const handleUpdate = useCallback(({ editor }) => {
    if (!documentId || !isAuthenticated) return;
    
    const currentContent = editor.getHTML();
    if (currentContent !== lastSavedContent.current) {
      setHasUnsavedChanges(true);
    }
  }, [documentId, isAuthenticated]);

  const saveDocument = useCallback(async () => {
    if (!editor || !documentId || !isAuthenticated) return;

    const content: DocumentContentType = {
      type: "doc",
      html: editor.getHTML(),
      text: editor.getText(),
    };

    try {
      await updateDocument.mutateAsync({ content });
      lastSavedContent.current = editor.getHTML();
      setHasUnsavedChanges(false);
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving document",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    }
  }, [documentId, editor, isAuthenticated, updateDocument, toast]);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: handleUpdate,
  });

  // Update editor content when document changes
  useEffect(() => {
    if (!editor || !document || editor.isDestroyed) return;

    // Only update title if document has changed and title is different
    if (document.title && document.title !== title) {
      setTitle(document.title);
    }
    
    const docContent = document.content as DocumentContentType;
    if (docContent?.html) {
      editor.commands.setContent(docContent.html, false);
      lastSavedContent.current = docContent.html;
      setHasUnsavedChanges(false);
    }
  }, [document, editor, title]);

  // Update title when it changes
  useEffect(() => {
    if (!documentId || !isAuthenticated || debouncedTitle === document?.title || debouncedTitle === "") return;
    updateDocument.mutate({ title: debouncedTitle });
  }, [debouncedTitle, documentId, document?.title, isAuthenticated, updateDocument]);

  // Handle unsaved changes when navigating away
  useBeforeUnload(
    useCallback((e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    }, [hasUnsavedChanges])
  );

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
        onSave={saveDocument}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      <DocumentContent editor={editor} />
    </div>
  );
}