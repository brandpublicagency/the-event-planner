
import { Editor, Range } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { useMentionSelector } from './useMentionSelector';
import { useMentionCommands } from './useMentionCommands';
import { useMentionSuggestion } from './useMentionSuggestion';
import { useInlineMentionCommands } from '../useInlineMentionCommands';

/**
 * Main hook that combines all mention functionality
 */
export function useMentionHandler(editor: Editor | null) {
  const [mentionRange, setMentionRange] = useState<Range | null>(null);
  
  // Use selector hook for UI state
  const {
    mentionQuery,
    setMentionQuery,
    mentionItems,
    mentionLoading,
    selectedItemIndex,
    setSelectedItemIndex,
    mentionSelectorRef,
    mentionPosition,
    closeAndResetMention,
    navigateSelection,
    updatePosition
  } = useMentionSelector();
  
  // Use commands hook for editor interactions
  const { handleMentionSelect } = useMentionCommands(editor);
  
  // Handle mention item selection
  const handleItemSelect = (item: any) => {
    handleMentionSelect(mentionRange, item);
    closeAndResetMention();
  };
  
  // Select an item by direction or current index
  const selectMentionItem = (direction: number) => {
    if (direction === 0) {
      // Select current item
      if (selectedItemIndex >= 0 && selectedItemIndex < mentionItems.length) {
        handleItemSelect(mentionItems[selectedItemIndex]);
      }
    } else {
      // Move selection up/down
      navigateSelection(direction);
    }
  };
  
  // Register keyboard handlers
  useInlineMentionCommands(
    editor,
    mentionQuery,
    closeAndResetMention,
    selectMentionItem
  );
  
  // Use suggestion hook for tiptap suggestion plugin
  const { configureSuggestion } = useMentionSuggestion(
    editor,
    mentionItems,
    setMentionQuery,
    setMentionRange,
    closeAndResetMention
  );
  
  // Update position when query changes
  useEffect(() => {
    if (editor && mentionQuery !== null) {
      updatePosition(editor);
    }
  }, [editor, mentionQuery, updatePosition]);
  
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
    mentionPosition,
    handleMentionSelect: handleItemSelect,
    closeAndResetMention,
    configureSuggestion,
    selectMentionItem
  };
}
