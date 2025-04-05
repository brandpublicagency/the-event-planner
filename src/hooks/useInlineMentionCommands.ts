
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

/**
 * Hook for handling keyboard shortcuts for mention commands
 */
export function useInlineMentionCommands(
  editor: Editor | null,
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: any) => void,
  selectMentionItem: (index: number) => void
) {
  // Add keyboard shortcut handling
  useEffect(() => {
    if (!editor) return;
    
    // Enhanced keyboard event handler with improved event capture
    const handleKeyDown = (event: KeyboardEvent) => {
      // If we have an active mention selector
      if (document.querySelector('[data-mention-active="true"]')) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          event.stopPropagation();
          selectMentionItem(1); // Move down
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          event.stopPropagation();
          selectMentionItem(-1); // Move up
        } else if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          event.stopPropagation();
          selectMentionItem(0); // Select current item
        } else if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setMentionQuery(null);
        }
      }
    };
    
    // Add global event listeners to capture keyboard events
    // Use capture phase (true) to ensure we get the events before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [editor, setMentionQuery, setMentionRange, selectMentionItem]);
}
