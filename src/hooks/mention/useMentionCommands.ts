
import { Editor, Range } from '@tiptap/react';
import { useCallback } from 'react';

/**
 * Hook for handling mention commands (insertion, deletion)
 */
export function useMentionCommands(editor: Editor | null) {
  // Handle mention selection
  const handleMentionSelect = useCallback((mentionRange: Range | null, item: any) => {
    if (!editor || !mentionRange) return;

    // First delete the range (the slash command)
    editor.chain().focus().deleteRange(mentionRange).run();
    
    // Then insert the mention
    editor.chain().focus().setMention({
      id: item.id,
      label: item.label,
      type: item.type,
    }).run();
    
    // Manually set cursor position after the mention
    setTimeout(() => {
      if (!editor.isDestroyed) {
        editor.commands.focus();
      }
    }, 10);
  }, [editor]);
  
  // Select item by index and handle insertion
  const selectMentionItem = useCallback((
    direction: number, 
    selectedItemIndex: number, 
    mentionItems: any[], 
    mentionRange: Range | null
  ) => {
    if (mentionItems.length === 0) return;
    
    if (direction === 0) {
      // Select current item
      if (selectedItemIndex >= 0 && selectedItemIndex < mentionItems.length) {
        handleMentionSelect(mentionRange, mentionItems[selectedItemIndex]);
      }
    }
    // Direction handling for up/down is handled by useMentionSelector
  }, [handleMentionSelect]);
  
  return {
    handleMentionSelect,
    selectMentionItem,
  };
}
