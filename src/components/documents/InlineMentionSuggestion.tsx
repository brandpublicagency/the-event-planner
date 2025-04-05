
import React, { useRef, useState, useEffect } from 'react';
import { MentionItem } from './MentionSelector';
import { MentionSuggestionList } from './mention/MentionSuggestionList';
import { MentionLoadingState } from './mention/MentionLoadingState';
import { MentionEmptyState } from './mention/MentionEmptyState';
import { useMentionKeyboardNavigation } from './mention/useMentionKeyboardNavigation';
import { useClickOutside } from './mention/useClickOutside';
import { useMentionSuggestionSearch } from './mention/useMentionSuggestionSearch';

interface InlineMentionSuggestionsProps {
  query: string;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  position: { top: number; left: number } | null;
  searchAllEntities: (query: string) => Promise<MentionItem[]>;
  isSearching?: boolean;
}

export const InlineMentionSuggestions = ({
  query,
  onSelect,
  onClose,
  position,
  searchAllEntities,
  isSearching = false
}: InlineMentionSuggestionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use custom hooks for search functionality
  const { suggestions, isLoading, error } = useMentionSuggestionSearch({
    query,
    position,
    searchAllEntities
  });
  
  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);
  
  // Use custom hook for keyboard navigation
  useMentionKeyboardNavigation({
    suggestions,
    isLoading: isLoading || isSearching,
    selectedIndex,
    setSelectedIndex,
    onSelect,
    onClose
  });
  
  // Use custom hook for handling clicks outside the component
  useClickOutside(containerRef, onClose);
  
  // Don't render anything if no position
  if (!position) return null;
  
  // Render suggestions inline with the text
  return (
    <div
      ref={containerRef}
      className="absolute z-10 max-w-[300px] inline-flex flex-col bg-transparent mention-suggestion-active"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      data-testid="mention-suggestions"
    >
      {isLoading || isSearching ? (
        <MentionLoadingState />
      ) : error || suggestions.length === 0 ? (
        <MentionEmptyState error={error} />
      ) : (
        <MentionSuggestionList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
