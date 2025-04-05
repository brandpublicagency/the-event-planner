
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

export function useEditorSetup(editor: Editor | null) {
  // Force editor focus when it becomes available
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setTimeout(() => {
        editor.commands.focus('end');
      }, 100);
    }
  }, [editor]);
}
