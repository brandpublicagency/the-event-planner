
import { useState, useCallback } from 'react';
import { MentionItem } from '@/components/documents/MentionSelector';

export interface MentionSuggestionState {
  active: boolean;
  position: { top: number; left: number } | null;
  query: string;
}

/**
 * Hook for managing mention suggestion UI state
 */
export function useMentionSuggestionState() {
  // State for mention suggestions
  const [mentionSuggestion, setMentionSuggestion] = useState<MentionSuggestionState>({
    active: false,
    position: null,
    query: ''
  });

  // Handle mention selection and close the suggestion popup
  const handleSelect = useCallback((editor: any, handleMentionSelect: Function) => (item: MentionItem) => {
    if (editor) {
      handleMentionSelect(item);
      setMentionSuggestion({
        active: false,
        position: null,
        query: ''
      });
    }
  }, []);

  // Close the suggestion popup
  const handleClose = useCallback(() => {
    setMentionSuggestion({
      active: false,
      position: null,
      query: ''
    });
  }, []);

  // Update the query in the suggestion state
  const updateQuery = useCallback((query: string) => {
    setMentionSuggestion(prev => ({
      ...prev,
      query
    }));
  }, []);

  // Activate the suggestion popup at the given position
  const activateSuggestion = useCallback((position: { top: number; left: number }) => {
    setMentionSuggestion({
      active: true,
      position,
      query: ''
    });
  }, []);

  return {
    mentionSuggestion,
    setMentionSuggestion,
    handleSelect,
    handleClose,
    updateQuery,
    activateSuggestion
  };
}
