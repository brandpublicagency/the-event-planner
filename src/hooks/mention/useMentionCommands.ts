
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
    
    // Get the current position
    const { state, view } = editor;
    const { selection } = state;
    const { $from, $to } = selection;
    
    // Find the start of the slash command
    const lineStart = $from.start();
    const text = $from.doc.textBetween(lineStart, $from.pos, '\n', '\n');
    const slashIndex = text.lastIndexOf('/');
    
    if (slashIndex === -1) return;
    
    // Calculate the absolute position of the slash
    const slashPos = lineStart + slashIndex;
    
    // Create a range from the slash to the current cursor position
    const range = { from: slashPos, to: $from.pos };
    
    // Delete the slash command text
    editor.chain().focus().deleteRange(range).run();
    
    // Insert the mention
    editor.commands.insertContent({
      type: 'mention',
      attrs: {
        id: item.id,
        label: item.label,
        type: item.type,
      }
    });
    
    // Ensure cursor position is after the mention
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
