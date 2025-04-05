
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { isDocumentContent } from "@/types/document";

export function useDocumentContent(editor: Editor | null, document: any) {
  const [contentSet, setContentSet] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setEditorReady(true);
    } else {
      setEditorReady(false);
    }
  }, [editor]);

  useEffect(() => {
    if (document?.id) {
      setContentSet(false);
    }
  }, [document?.id]);

  useEffect(() => {
    if (!editorReady || !document?.content || contentSet) return;

    console.log("Loading document content:", document.content);

    try {
      if (isDocumentContent(document.content)) {
        console.log("Setting editor content to:", document.content.html?.substring(0, 100));
        editor?.commands.setContent(document.content.html || '');
        setContentSet(true);
      } else {
        console.warn("Invalid document content format:", document.content);
      }
    } catch (err) {
      console.error("Error setting document content:", err);
    }
  }, [document, editorReady, editor, contentSet]);

  return {
    contentSet
  };
}
