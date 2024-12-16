import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DocumentContent } from "./DocumentContent";
import { DocumentTitle } from "./DocumentTitle";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import type { DocumentContent as DocumentContentType } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const isAuthenticated = useDocumentAuth();
  const debouncedTitle = useDebounce(title, 1000);

  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (!documentId || !isAuthenticated) return;
      
      const content: DocumentContentType = {
        type: "doc",
        html: editor.getHTML(),
        text: editor.getText(),
      };

      updateDocument.mutate({ content });
    },
  });

  // Update editor content when document changes
  useEffect(() => {
    if (document && editor && !editor.isDestroyed) {
      // Only update title if document has changed and title is different
      if (document.title && document.title !== title) {
        console.log('Setting title from document:', document.title);
        setTitle(document.title);
      }
      
      const docContent = document.content as DocumentContentType;
      if (docContent?.html && editor.getHTML() !== docContent.html) {
        editor.commands.setContent(docContent.html);
      }
    }
  }, [document, editor, title]);

  // Update title when it changes
  useEffect(() => {
    if (documentId && isAuthenticated && debouncedTitle !== document?.title && debouncedTitle !== "") {
      console.log('Updating title to:', debouncedTitle);
      updateDocument.mutate({ title: debouncedTitle });
    }
  }, [debouncedTitle, documentId, document?.title, isAuthenticated, updateDocument]);

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