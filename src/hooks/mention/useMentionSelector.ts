
import { useState, useRef, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useMentionItems } from './useMentionItems';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Hook for managing the mention selector UI state
 */
export function useMentionSelector() {
  // Query and items state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const { items: mentionItems, isLoading: mentionLoading } = useMentionItems(mentionQuery);
  
  // Selection state - default to 0 (first item)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  
  // Position state for the dropdown
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  
  // Reference to the dropdown element
  const mentionSelectorRef = useRef<HTMLDivElement>(null);
  
  // Reset selection and clear mention state
  const closeAndResetMention = useCallback(() => {
    setMentionQuery(null);
    setSelectedItemIndex(0);
  }, []);
  
  // Update selection based on navigation direction
  const navigateSelection = useCallback((direction: number) => {
    if (mentionItems.length === 0) return;
    
    setSelectedItemIndex(prev => {
      // Calculate the new index with wrapping
      if (direction < 0) {
        // Up: if at first item, go to last
        return prev <= 0 ? mentionItems.length - 1 : prev - 1;
      } else {
        // Down: if at last item, go to first
        return (prev + 1) % mentionItems.length;
      }
    });
  }, [mentionItems]);
  
  // Reset selected index when items change
  useEffect(() => {
    // When items load, ensure the selected index is valid
    if (mentionItems.length > 0 && selectedItemIndex >= mentionItems.length) {
      setSelectedItemIndex(0);
    }
  }, [mentionItems, selectedItemIndex]);
  
  // Update the position of the dropdown based on editor cursor position
  const updatePosition = useCallback((editor: Editor) => {
    if (!editor.view) return;
    
    // Get the current cursor position
    const { view } = editor;
    const { selection } = view.state;
    const { from } = selection;
    
    // Get coordinates for the current cursor position
    const domRect = view.coordsAtPos(from);
    
    // Position the dropdown below the cursor
    setMentionPosition({
      top: domRect.bottom + window.scrollY,
      left: domRect.left + window.scrollX,
    });
  }, []);
  
  return {
    mentionQuery,
    setMentionQuery,
    mentionItems,
    mentionLoading,
    selectedItemIndex,
    setSelectedItemIndex,
    mentionPosition,
    mentionSelectorRef,
    closeAndResetMention,
    navigateSelection,
    updatePosition
  };
}
