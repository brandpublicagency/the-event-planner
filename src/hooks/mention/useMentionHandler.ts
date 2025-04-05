
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
  
  // Log active state for debugging
  useEffect(() => {
    if (mentionQuery !== null) {
      console.log('Mention active:', { 
        query: mentionQuery,
        itemsCount: mentionItems.length,
        loading: mentionLoading,
        selectedIndex: selectedItemIndex,
        position: mentionPosition
      });
    }
  }, [mentionQuery, mentionItems, mentionLoading, selectedItemIndex, mentionPosition]);
  
  // Handle mention item selection
  const handleItemSelect = (item: any) => {
    console.log('handleItemSelect called with item:', item);
    handleMentionSelect(mentionRange, item);
    closeAndResetMention();
  };
  
  // Select an item by direction or current index
  const selectMentionItem = (direction: number) => {
    console.log('selectMentionItem called with direction:', direction);
    
    // If there are no items or we're still loading, don't do anything
    if (mentionLoading) {
      console.log('Cannot select item: still loading');
      return;
    }
    
    if (mentionItems.length === 0) {
      console.log('No items to select, closing mention');
      // No items to select, just close the mention
      closeAndResetMention();
      return;
    }
    
    if (direction === 0) {
      // Select current item - make sure selectedItemIndex is within bounds
      const validIndex = Math.max(0, Math.min(selectedItemIndex, mentionItems.length - 1));
      console.log('Selecting current item at index:', validIndex);
      
      if (validIndex >= 0 && validIndex < mentionItems.length) {
        handleItemSelect(mentionItems[validIndex]);
      }
    } else {
      // Move selection up/down
      console.log('Navigating selection with direction:', direction);
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
      console.log('Updating mention position');
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
