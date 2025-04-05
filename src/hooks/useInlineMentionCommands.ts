
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

/**
 * Hook to handle keyboard commands for the mention selector
 */
export function useInlineMentionCommands(
  editor: Editor | null,
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: any) => void,
  selectMentionItem: (direction: number) => void
) {
  useEffect(() => {
    if (!editor) return;

    // Function to handle keyboard events when mention is active
    const handleMentionKeydown = (event: KeyboardEvent) => {
      // Only handle events when mention is active
      const mentionActive = document.querySelector('[data-mention-active="true"]');
      if (!mentionActive) return;

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
        selectMentionItem(-1); // Go up
      } else if (event.key === 'ArrowDown') {
        selectMentionItem(1); // Go down
      } else if (event.key === 'Enter') {
        selectMentionItem(0); // Select current
      } else if (event.key === 'Escape') {
        setMentionQuery(null); // Close
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleMentionKeydown);

    // Clean up
    return () => {
      document.removeEventListener('keydown', handleMentionKeydown);
    };
  }, [editor, selectMentionItem, setMentionQuery, setMentionRange]);
}
