
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

export function useInlineMentionCommands(
  editor: Editor | null,
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: any) => void,
  setMentionClientRect: (rect: DOMRect | null) => void
) {
  // Add keyboard shortcut handling
  useEffect(() => {
    if (!editor) return;
    
    // Enhanced keyboard event handler with improved event capture
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior and stop propagation for navigation keys
      // when dropdown is active to allow proper dropdown navigation
      const isDropdownActive = document.querySelector('[data-selected="true"]');
      
      if (isDropdownActive) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || 
            event.key === 'Enter' || event.key === 'Tab') {
          // Completely stop propagation for these keys when dropdown is active
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };
    
    // Add global event listeners to capture keyboard events
    // Use capture phase (true) to ensure we get the events before other handlers
    editor.view.dom.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      editor.view.dom.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [editor]);
}
