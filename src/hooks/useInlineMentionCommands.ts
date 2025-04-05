
import { Editor } from '@tiptap/react';
import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard commands for the mention selector
 */
export function useInlineMentionCommands(
  editor: Editor | null,
  mentionQuery: string | null,
  onClose: () => void,
  onSelect: (direction: number) => void
) {
  const handleKeydown = useCallback((event: KeyboardEvent) => {
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
  }, [mentionQuery, onSelect, onClose]);

  useEffect(() => {
    if (!editor || mentionQuery === null) return;

    // Add event listener
    document.addEventListener('keydown', handleKeydown);

    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [editor, mentionQuery, handleKeydown]);
}
