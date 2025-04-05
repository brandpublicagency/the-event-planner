
import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

export function useEditorSetup(editor: Editor | null) {
  useEffect(() => {
    if (!editor) return;
    
    // Set up any editor listeners or configurations
    
    // Log when editor is ready
    console.log('Editor is ready and configured');
    
    // Debug: Log any user key presses in the editor
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`Key pressed in editor: ${e.key}`);
      
      // Special handling for slash key
      if (e.key === '/') {
        console.log('Slash key detected by editor setup');
      }
    };

    // Add listener to editor DOM
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up on unmount
    return () => {
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        editorElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [editor]);
}
