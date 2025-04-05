
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import { useDocumentSave } from './useDocumentSave';
import { useDocumentContent } from './useDocumentContent';

export function useDocumentState(documentId: string | null, editor: Editor | null, isAuthenticated: boolean) {
  const { document, isLoading, error } = useDocument(documentId, isAuthenticated);
  const { saveDocument, isSaving } = useDocumentSave(documentId, editor);
  const { contentSet } = useDocumentContent(editor, document);

  return {
    document,
    isLoading,
    error,
    saveDocument,
    isSaving,
    contentSet
  };
}
