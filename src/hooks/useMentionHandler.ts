
import { Editor, Range } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import { useMentionItems, MentionCategory } from './useMentionItems';
import { PluginKey } from '@tiptap/pm/state';
import { SuggestionOptions } from '@tiptap/suggestion';

// Create a plugin key for the suggestion
export const suggestionPluginKey = new PluginKey('mention-suggestion');

export function useMentionHandler(editor: Editor | null) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionRange, setMentionRange] = useState<Range | null>(null);
  const [mentionClientRect, setMentionClientRect] = useState<DOMRect | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<MentionCategory>(null);
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery, selectedCategory);
  const mentionSelectorRef = useRef<HTMLDivElement>(null);

  // Handle category selection
  const handleCategorySelect = useCallback((category: MentionCategory) => {
    setSelectedCategory(category);
    setSelectedItemIndex(0);
    setMentionQuery('');
  }, []);

  // Close and reset mention state
  const closeAndResetMention = useCallback(() => {
    if (mentionQuery !== null) {
      setMentionQuery(null);
      setMentionRange(null);
      setMentionClientRect(null);
      setSelectedItemIndex(0);
      setSelectedCategory(null);
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
            const { editor, range, query } = props;
            
            // Update the mention state
            setMentionQuery(query);
            setMentionRange(range);
            setSelectedItemIndex(0);
            setSelectedCategory(null);
            
            // Get client rect of the current position
            if (editor.view.domAtPos(range.from)) {
              const domAtPos = editor.view.domAtPos(range.from);
              if (domAtPos && domAtPos.node) {
                const element = domAtPos.node.parentElement;
                if (element) {
                  const rect = element.getBoundingClientRect();
                  setMentionClientRect(rect);
                }
              }
            }
          },
          onUpdate: (props) => {
            const { editor, range, query } = props;
            
            // Update the mention state
            setMentionQuery(query);
            setMentionRange(range);
            
            // Get client rect of the current position
            if (editor.view.domAtPos(range.from)) {
              const domAtPos = editor.view.domAtPos(range.from);
              if (domAtPos && domAtPos.node) {
                const element = domAtPos.node.parentElement;
                if (element) {
                  const rect = element.getBoundingClientRect();
                  setMentionClientRect(rect);
                }
              }
            }
          },
          onKeyDown: (props) => {
            const { event } = props;
            
            // Handle keyboard navigation
            if (event.key === 'ArrowUp') {
              event.preventDefault(); // Prevent cursor movement
              setSelectedItemIndex((prev) => {
                if (prev <= 0) {
                  return mentionItems.length - 1;
                }
                return prev - 1;
              });
              return true;
            }
            
            if (event.key === 'ArrowDown') {
              event.preventDefault(); // Prevent cursor movement
              setSelectedItemIndex((prev) => {
                if (prev >= mentionItems.length - 1) {
                  return 0;
                }
                return prev + 1;
              });
              return true;
            }
            
            if (event.key === 'Enter' || event.key === 'Tab') {
              event.preventDefault(); // Prevent newline insertion
              if (mentionItems.length && selectedItemIndex >= 0 && selectedItemIndex < mentionItems.length) {
                const item = mentionItems[selectedItemIndex];
                if (item) {
                  // Check if this is a category selection
                  if (item.id.startsWith('category-') && selectedCategory === null) {
                    setSelectedCategory(item.type as MentionCategory);
                    setSelectedItemIndex(0);
                    setMentionQuery(''); // Clear the query when selecting a category
                    return true;
                  } else {
                    // Handle item selection
                    handleMentionSelect(item);
                    return true;
                  }
                }
              }
              return false;
            }
            
            if (event.key === 'Escape') {
              // If category is selected, go back to categories
              if (selectedCategory !== null) {
                setSelectedCategory(null);
                setSelectedItemIndex(0);
                return true;
              } else {
                // Clear mention state completely
                closeAndResetMention();
                return true;
              }
            }
            
            if (event.key === 'Backspace' && selectedCategory !== null && !mentionQuery) {
              // If query is empty and backspace is pressed, go back to categories
              setSelectedCategory(null);
              setSelectedItemIndex(0);
              return false; // Let the editor handle the backspace
            }
            
            // Allow normal typing for all other keys
            return false;
          },
          onExit: () => {
            // Adding a delay to prevent too quick disappearance
            setTimeout(() => {
              closeAndResetMention();
            }, 250); // Increased delay to allow for interaction
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
        const transaction = editor.state.tr;
        transaction.setSelection(editor.state.selection.constructor.create(
          editor.state.doc,
          editor.state.selection.anchor,
          editor.state.selection.head
        ));
        editor.view.dispatch(transaction);
      }
    };
  }, [
    editor, 
    mentionItems, 
    selectedItemIndex, 
    selectedCategory, 
    closeAndResetMention, 
    handleMentionSelect
  ]);

  return {
    mentionQuery,
    setMentionQuery,
    mentionRange,
    setMentionRange,
    mentionClientRect,
    setMentionClientRect,
    selectedItemIndex,
    setSelectedItemIndex,
    selectedCategory,
    setSelectedCategory,
    mentionItems,
    mentionLoading,
    mentionSelectorRef,
    handleCategorySelect,
    closeAndResetMention,
    handleMentionSelect,
    configureSuggestion
  };
}
