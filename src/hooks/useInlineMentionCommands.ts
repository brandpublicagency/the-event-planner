
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

/**
 * Hook to handle keyboard commands for the mention selector
 */
export function useInlineMentionCommands(
  editor: Editor | null,
  mentionQuery: string | null,
  onClose: () => void,
  onSelect: (direction: number) => void
) {
  useEffect(() => {
    if (!editor || mentionQuery === null) return;

    // Function to handle keyboard events when mention is active
    const handleMentionKeydown = (event: KeyboardEvent) => {
      // Only handle events when mention is active
      if (mentionQuery === null) return;

      // Prevent default behavior for our handled keys
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'Enter' ||
        event.key === 'Escape'
      ) {
        event.preventDefault();
      }

      // Handle navigation
      if (event.key === 'ArrowUp') {
        onSelect(-1); // Go up
      } else if (event.key === 'ArrowDown') {
        onSelect(1); // Go down
      } else if (event.key === 'Enter') {
        onSelect(0); // Select current
      } else if (event.key === 'Escape') {
        onClose(); // Close
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleMentionKeydown);

    // Clean up
    return () => {
      document.removeEventListener('keydown', handleMentionKeydown);
    };
  }, [editor, mentionQuery, onSelect, onClose]);
}
