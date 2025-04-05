
import { useCallback, useRef, useState, useEffect } from 'react';
import { useMentionItems } from './useMentionItems';

/**
 * Hook for managing mention selector UI state
 */
export function useMentionSelector() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPosition, setMentionPosition] = useState<{ top: number; left: number } | null>(null);
  const mentionSelectorRef = useRef<HTMLDivElement>(null);
  
  // Get items based on the current query
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery);
  
  // Reset selected index when items change
  useEffect(() => {
    if (mentionItems.length > 0 && selectedItemIndex >= mentionItems.length) {
      setSelectedItemIndex(0);
    }
  }, [mentionItems, selectedItemIndex]);
  
  // Close and reset mention state
  const closeAndResetMention = useCallback(() => {
    if (mentionQuery !== null) {
      setMentionQuery(null);
      setSelectedItemIndex(0);
    }
  }, [mentionQuery]);
  
  // Select item relatively (next/previous)
  const selectItem = useCallback((direction: number) => {
    if (mentionItems.length === 0) return;
    
    if (direction === 0) {
      // Select current item - handled by parent component
      return;
    }
    
    setSelectedItemIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      
      // Wrap around
      if (newIndex < 0) newIndex = mentionItems.length - 1;
      if (newIndex >= mentionItems.length) newIndex = 0;
      
      return newIndex;
    });
  }, [mentionItems]);
  
  // Update mention position
  const updatePosition = useCallback((editor: any) => {
    if (mentionQuery !== null && editor) {
      const { view } = editor;
      const { state } = view;
      const { selection } = state;
      const { ranges } = selection;
      const from = Math.min(...ranges.map(range => range.$from.pos));
      
      // Get coordinates for the current selection
      const start = view.coordsAtPos(from);
      
      setMentionPosition({
        top: start.bottom + 10,
        left: start.left,
      });
    } else {
      setMentionPosition(null);
    }
  }, [mentionQuery]);
  
  return {
    mentionQuery,
    setMentionQuery,
    mentionItems,
    mentionLoading,
    selectedItemIndex,
    setSelectedItemIndex,
    mentionSelectorRef,
    mentionPosition,
    closeAndResetMention,
    selectItem,
    updatePosition
  };
}
