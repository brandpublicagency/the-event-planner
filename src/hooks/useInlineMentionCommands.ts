
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
      
      // Check for direct category commands at the start of a line
      const directCommands = [
        { pattern: /^\/event\s+(.+)$/, type: 'event' },
        { pattern: /^\/task\s+(.+)$/, type: 'task' },
        { pattern: /^\/doc\s+(.+)$/, type: 'document' },
        { pattern: /^\/user\s+(.+)$/, type: 'user' }
      ];
      
      for (const { pattern, type } of directCommands) {
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
    
    // We don't actually register this as an extension,
    // we just check for it on each editor update
    const checkForShortcuts = () => {
      handleMentionShortcut({ editor });
    };
    
    // Add event listener for editor updates
    editor.on('update', checkForShortcuts);
    
    return () => {
      editor.off('update', checkForShortcuts);
    };
  }, [editor, setSelectedCategory, setMentionQuery, setMentionRange, setMentionClientRect]);
}
