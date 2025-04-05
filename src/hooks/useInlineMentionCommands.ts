
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';
import { MentionCategory } from './useMentionItems';

export function useInlineMentionCommands(
  editor: Editor | null,
  setSelectedCategory: (category: MentionCategory) => void,
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: any) => void,
  setMentionClientRect: (rect: DOMRect | null) => void
) {
  // Add inline mention support for direct category selection
  useEffect(() => {
    if (!editor) return;
    
    const handleMentionShortcut = ({ editor }: { editor: Editor }) => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Get the current line content
      const lineStart = $from.start();
      const lineEnd = $from.end();
      const line = state.doc.textBetween(lineStart, lineEnd, ' ');
      
      // Check for simplified shortcut prefixes at the start of a line
      const shortcutPrefixes = [
        { pattern: /^\/e\s+(.+)$/, type: 'event' },
        { pattern: /^\/t\s+(.+)$/, type: 'task' },
        { pattern: /^\/d\s+(.+)$/, type: 'document' },
        { pattern: /^\/u\s+(.+)$/, type: 'user' }
      ];
      
      for (const { pattern, type } of shortcutPrefixes) {
        const match = line.match(pattern);
        if (match) {
          const query = match[1].trim();
          if (query) {
            // Set the category and trigger a search
            setSelectedCategory(type as MentionCategory);
            setMentionQuery(query);
            
            // Create a range to replace the command
            const from = lineStart;
            const to = lineStart + match[0].length;
            const range = { from, to };
            setMentionRange(range);
            
            // Get client rect
            if (editor.view.domAtPos(from)) {
              const domAtPos = editor.view.domAtPos(from);
              if (domAtPos && domAtPos.node) {
                const element = domAtPos.node.parentElement;
                if (element) {
                  const rect = element.getBoundingClientRect();
                  setMentionClientRect(rect);
                }
              }
            }
            
            return true;
          }
        }
      }
      
      return false;
    };
    
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
    
    // We don't actually register this as an extension,
    // we just check for it on each editor update
    const checkForShortcuts = () => {
      handleMentionShortcut({ editor });
    };
    
    // Add event listener for editor updates
    editor.on('update', checkForShortcuts);
    
    // Add global event listeners to capture keyboard events
    // Use capture phase (true) to ensure we get the events before other handlers
    editor.view.dom.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      editor.off('update', checkForShortcuts);
      editor.view.dom.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [editor, setSelectedCategory, setMentionQuery, setMentionRange, setMentionClientRect]);
}
