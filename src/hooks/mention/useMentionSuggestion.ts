
import { Editor, Range } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { mentionSuggestionKey } from '@/components/documents/MentionExtension';
import { SuggestionOptions } from '@tiptap/suggestion';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Hook for configuring the mention suggestion plugin
 */
export function useMentionSuggestion(
  editor: Editor | null,
  mentionItems: MentionItem[],
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: Range | null) => void,
  resetMention: () => void
) {
  // Configure the mention suggestion extension
  const configureSuggestion = useCallback((): SuggestionOptions => {
    if (!editor) {
      throw new Error('Editor is required for mention suggestions');
    }
    
    console.log('Configuring mention suggestion with char: "/"');
    
    return {
      editor,
      pluginKey: mentionSuggestionKey,
      char: '/',
      allowSpaces: false,
      startOfLine: false,
      command: ({ editor, range, props }) => {
        console.log('Mention suggestion command triggered', { range, props });
        
        // Delete the slash command from the document
        editor.chain().focus().deleteRange(range).run();
        
        // Insert the mention at the current position
        editor.commands.insertContent({
          type: 'mention',
          attrs: {
            id: props.id,
            label: props.label,
            type: props.type
          }
        });
        
        console.log('Mention inserted', props);
        
        // Ensure cursor position is after the mention
        editor.commands.focus();
      },
      items: ({ query }) => {
        console.log('Filtering mention items with query:', query);
        
        // Return all items if query is empty
        if (!query || query.length === 0) {
          console.log('Empty query, returning all items:', mentionItems.length);
          return mentionItems.slice(0, 10);
        }
        
        // Filter items based on query
        const lowerQuery = query.toLowerCase();
        const filtered = mentionItems.filter(item => 
          item.label.toLowerCase().includes(lowerQuery) ||
          item.type.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); // Limit to 10 items for performance
        
        console.log('Filtered mention items:', filtered.length);
        return filtered;
      },
      render: () => {
        return {
          onStart: (props) => {
            console.log('Mention suggestion started:', props);
            const { range, query } = props;
            
            setMentionQuery(query);
            setMentionRange(range);
          },
          onUpdate: (props) => {
            console.log('Mention suggestion updated:', props);
            const { range, query } = props;
            
            setMentionQuery(query);
            setMentionRange(range);
          },
          onKeyDown: (props) => {
            console.log('Mention suggestion keydown:', props);
            // Let our custom keyboard handler take care of it
            return false;
          },
          onExit: () => {
            console.log('Mention suggestion exited');
            resetMention();
          }
        };
      }
    };
  }, [editor, mentionItems, setMentionQuery, setMentionRange, resetMention]);

  return {
    configureSuggestion,
    mentionSuggestionKey
  };
}
