
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { PluginKey } from '@tiptap/pm/state';
import { SuggestionOptions } from '@tiptap/suggestion';

// Create a plugin key for the suggestion
export const mentionPluginKey = new PluginKey('mention-suggestion');

/**
 * Hook for configuring the mention suggestion plugin
 */
export function useMentionSuggestion(
  editor: Editor | null,
  mentionItems: any[],
  setMentionQuery: (query: string | null) => void,
  setMentionRange: (range: any) => void,
  resetMention: () => void
) {
  // Configure the mention suggestion extension
  const configureSuggestion = useCallback((): SuggestionOptions => {
    return {
      editor: editor!,
      pluginKey: mentionPluginKey,
      char: '/',
      command: ({ editor, range, props }) => {
        // Delete the slash command from the document
        editor.chain().focus().deleteRange(range).run();
        
        // Insert the mention at the current position
        editor.chain().focus().setMention({
          id: props.id,
          label: props.label,
          type: props.type
        }).run();
        
        // Ensure cursor position is after the mention
        setTimeout(() => {
          if (!editor.isDestroyed) {
            editor.commands.focus();
          }
        }, 10);
      },
      items: () => mentionItems,
      render: () => {
        return {
          onStart: (props) => {
            const { range, query } = props;
            setMentionQuery(query);
            setMentionRange(range);
          },
          onUpdate: (props) => {
            const { range, query } = props;
            setMentionQuery(query);
            setMentionRange(range);
          },
          onKeyDown: () => {
            // We handle keyboard interactions through useInlineMentionCommands
            return false;
          },
          onExit: () => {
            resetMention();
          }
        };
      }
    };
  }, [
    editor, 
    mentionItems, 
    setMentionQuery,
    setMentionRange,
    resetMention
  ]);

  return {
    configureSuggestion,
    mentionPluginKey
  };
}
