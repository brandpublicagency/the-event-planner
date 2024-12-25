import { useEditor } from '@tiptap/react';
import { Loader2 } from "lucide-react";
import { useDocumentAuth } from "@/hooks/useDocumentAuth";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocumentState } from "@/hooks/useDocumentState";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const isAuthenticated = useDocumentAuth();
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  });

  const { document, isLoading, error } = useDocumentState(documentId, editor, isAuthenticated);

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