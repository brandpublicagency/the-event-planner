
import { Editor, Range } from '@tiptap/react';
import { useCallback } from 'react';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Hook for handling mention commands (insertion)
 */
export function useMentionCommands(editor: Editor | null) {
  // Handle mention selection - inserts the mention at the current position
  const handleMentionSelect = useCallback((mentionRange: Range | null, item: MentionItem) => {
    if (!editor || !mentionRange) return;

    // First delete the range (the slash command)
    editor.chain().focus().deleteRange(mentionRange).run();
    
    // Then insert the mention
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
  
  // Handle changing the selected index in the mention dropdown
  const handleSelectionNavigation = useCallback((direction: number) => {
    // This function is implemented in useMentionSelector
    // We just provide it here as an interface
    return direction;
  }, []);
  
  return {
    handleMentionSelect,
    handleSelectionNavigation
  };
}
