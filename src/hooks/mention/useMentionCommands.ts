
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Hook for handling mention commands (insertion)
 */
export function useMentionCommands(editor: Editor | null) {
  // Handle mention selection - inserts the mention at the current position
  const handleMentionSelect = useCallback((item: MentionItem) => {
    if (!editor) return;

    console.log('Adding mention:', item);
    
    // Insert the mention
    editor.commands.insertContent({
      type: 'mention',
      attrs: {
        id: item.id,
        label: item.label,
        type: item.type,
      }
    });
    
    // Manually set cursor position after the mention
    setTimeout(() => {
      if (!editor.isDestroyed) {
        editor.commands.focus();
      }
    }, 10);
  }, [editor]);
  
  return {
    handleMentionSelect
  };
}
