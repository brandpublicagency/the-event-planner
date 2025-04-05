
import { Editor, Range } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import { useMentionItems } from './useMentionItems';
import { PluginKey } from '@tiptap/pm/state';
import { SuggestionOptions } from '@tiptap/suggestion';

// Create a plugin key for the suggestion
export const suggestionPluginKey = new PluginKey('mention-suggestion');

export function useMentionHandler(editor: Editor | null) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionRange, setMentionRange] = useState<Range | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery);
  const mentionSelectorRef = useRef<HTMLDivElement>(null);

  // Close and reset mention state
  const closeAndResetMention = useCallback(() => {
    if (mentionQuery !== null) {
      setMentionQuery(null);
      setMentionRange(null);
      setSelectedItemIndex(0);
    }
  }, [mentionQuery]);

  // Handle mention selection
  const handleMentionSelect = useCallback((item: any) => {
    if (editor && mentionRange) {
      // First delete the range (the slash command)
      editor.chain().focus().deleteRange(mentionRange).run();
      
      // Then insert the mention
      editor.chain().focus().setMention({
        id: item.id,
        label: item.label,
        type: item.type,
      }).run();
      
      // Manually set cursor position after the mention
      setTimeout(() => {
        if (!editor.isDestroyed) {
          editor.commands.focus();
        }
      }, 10);
      
      // Clear mention state
      closeAndResetMention();
    }
  }, [editor, mentionRange, closeAndResetMention]);

  // Select item relatively (next/previous)
  const selectMentionItem = useCallback((direction: number) => {
    if (mentionItems.length === 0) return;
    
    if (direction === 0) {
      // Select current item
      if (selectedItemIndex >= 0 && selectedItemIndex < mentionItems.length) {
        handleMentionSelect(mentionItems[selectedItemIndex]);
      }
    } else {
      setSelectedItemIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = mentionItems.length - 1;
        if (newIndex >= mentionItems.length) newIndex = 0;
        
        return newIndex;
      });
    }
  }, [mentionItems, selectedItemIndex, handleMentionSelect]);

  // Configure the mention suggestion extension
  const configureSuggestion = useCallback((): SuggestionOptions => {
    return {
      editor: editor!,
      pluginKey: suggestionPluginKey,
      char: '/',
      items: () => mentionItems,
      render: () => {
        return {
          onStart: (props) => {
            const { range, query } = props;
            // Only activate if query has at least 3 characters
            if (query && query.length >= 3) {
              setMentionQuery(query);
              setMentionRange(range);
              setSelectedItemIndex(0);
            }
          },
          onUpdate: (props) => {
            const { range, query } = props;
            // Only show if query has at least 3 characters
            if (query && query.length >= 3) {
              setMentionQuery(query);
              setMentionRange(range);
              setSelectedItemIndex(0);
            } else {
              setMentionQuery(null);
            }
          },
          onKeyDown: () => {
            // Handle all keyboard interactions through useInlineMentionCommands hook
            return false;
          },
          onExit: () => {
            closeAndResetMention();
          }
        };
      },
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
      }
    };
  }, [
    editor, 
    mentionItems, 
    closeAndResetMention
  ]);

  return {
    mentionQuery,
    setMentionQuery,
    mentionRange,
    setMentionRange,
    selectedItemIndex,
    setSelectedItemIndex,
    mentionItems,
    mentionLoading,
    mentionSelectorRef,
    handleMentionSelect,
    closeAndResetMention,
    configureSuggestion,
    selectMentionItem
  };
}
