
import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import { DocumentContent } from "@/types/document";
import { extractMentions, updateMentions } from "@/utils/mentionUtils";

// Define the interface for saveDocument parameters
export interface SaveDocumentOptions {
  title?: string;
  content?: string;
  showToast?: boolean;
}

export function useDocumentSave(documentId: string | null, editor: Editor | null) {
  const [isSaving, setIsSaving] = useState(false);
  const { updateDocument } = useDocument(documentId, true);

  const saveDocument = async (options: SaveDocumentOptions = {}) => {
    const { title, content: contentOverride, showToast = true } = options;
    
    if ((!editor && !contentOverride) || !documentId) {
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
      const mentions = extractMentions(currentContent);
      
      await updateDocument.mutateAsync({ 
        title: firstLine,
        content: content,
        showToast 
      });
      
      await updateMentions(documentId, mentions);
      
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveDocument,
    isSaving
  };
}
