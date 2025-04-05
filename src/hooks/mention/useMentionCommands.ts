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
  
  // We're not using this function anymore but keeping it for API compatibility
  const selectMentionItem = useCallback(() => {
    // This functionality is now handled by useMentionHandler directly
  }, []);
  
  return {
    handleMentionSelect,
    selectMentionItem,
  };
}
