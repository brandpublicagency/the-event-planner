
import { Editor, Range } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
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
  setMentionRange: (range: Range | null) => void,
  resetMention: () => void
) {
  // Configure the mention suggestion extension
  const configureSuggestion = useCallback((): SuggestionOptions => {
    if (!editor) {
      throw new Error('Editor is required for mention suggestions');
    }
    
    return {
      editor,
      pluginKey: mentionPluginKey,
      char: '/',
      command: ({ editor, range, props }) => {
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
        
        // Ensure cursor position is after the mention
        setTimeout(() => {
          if (!editor.isDestroyed) {
            editor.commands.focus();
          }
        }, 10);
      },
      items: ({ query }) => {
        // Filter items based on query
        return mentionItems.filter(item => 
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Limit to 10 items for performance
      },
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
          onKeyDown: () => false, // We handle keyboard interactions through useInlineMentionCommands
          onExit: () => {
            resetMention();
          }
        };
      }
    };
  }, [editor, mentionItems, setMentionQuery, setMentionRange, resetMention]);

  // Apply the suggestion configuration to the MentionNode extension
  useEffect(() => {
    if (!editor) return;
    
    // Get the mention node extension
    const mentionExtension = editor.extensionManager.extensions.find(
      ext => ext.name === 'mention'
    );
    
    if (mentionExtension && mentionExtension.options) {
      // Apply the suggestion configuration
      mentionExtension.options.suggestion = configureSuggestion();
      
      // Force a re-render of the editor to apply the new configuration
      editor.view.updateState(editor.view.state);
    }
  }, [editor, configureSuggestion]);

  return {
    configureSuggestion,
    mentionPluginKey
  };
}
