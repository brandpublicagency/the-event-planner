
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { useMentionCommands } from './useMentionCommands';

/**
 * Main hook that combines all mention functionality
 */
export function useMentionHandler(editor: Editor | null) {
  // Use commands hook for editor interactions
  const { handleMentionSelect } = useMentionCommands(editor);
  
  // Direct slash key handler - we don't need this for direct commands
  const handleSlashKey = useCallback(() => {
    if (editor && editor.isActive) {
      console.log('Slash command typed - now use /task, /event, /user, or /doc to mention items');
    }
  }, [editor]);
  
  // Add a direct key listener for general slash info
  useEffect(() => {
    if (!editor) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target instanceof HTMLElement && e.target.closest('.ProseMirror')) {
        console.log('Slash key detected - use specific commands:');
        console.log('  /task - Mention a task');
        console.log('  /event - Mention an event');
        console.log('  /user - Mention a user');
        console.log('  /doc - Mention a document');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);
  
  return {
    handleMentionSelect
  };
}

// Add the missing import
import { useEffect } from 'react';
