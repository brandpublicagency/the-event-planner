
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

    console.log('Keyboard event captured in mention mode:', event.key);

    // Prevent default behavior for our handled keys
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === 'Escape'
    ) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Prevented default for key:', event.key);
    }

    // Handle navigation
    if (event.key === 'ArrowUp') {
      console.log('Navigation: up');
      onSelect(-1); // Go up
    } else if (event.key === 'ArrowDown') {
      console.log('Navigation: down');
      onSelect(1); // Go down
    } else if (event.key === 'Enter') {
      console.log('Selection: enter');
      // Select current item (0 indicates "select current")
      onSelect(0); 
    } else if (event.key === 'Escape') {
      console.log('Closing: escape');
      onClose(); // Close
    }
  }, [mentionQuery, onSelect, onClose]);

  useEffect(() => {
    if (!editor || mentionQuery === null) return;

    console.log('Adding keyboard event listener for mentions');
    
    // Add event listener with capture phase to intercept events before they reach the editor
    document.addEventListener('keydown', handleKeydown, { capture: true });

    // Clean up
    return () => {
      console.log('Removing keyboard event listener for mentions');
      document.removeEventListener('keydown', handleKeydown, { capture: true });
    };
  }, [editor, mentionQuery, handleKeydown]);
}
