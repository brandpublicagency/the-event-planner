
import { Editor } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { useMentionCommands } from './useMentionCommands';
import { useSearchEntities } from './useSearchEntities';
import { useMentionSuggestionState } from './useMentionSuggestionState';
import { useMentionKeyboardEvents } from './useMentionKeyboardEvents';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Main hook that combines all mention functionality for inline autocomplete
 */
export function useMentionHandler(editor: Editor | null) {
  // Use commands hook for editor interactions
  const { handleMentionSelect } = useMentionCommands(editor);
  
  // Use hook for searching entities
  const { searchAllEntities, isSearching } = useSearchEntities();
  
  // Use hook for managing mention suggestion state
  const { 
    mentionSuggestion, 
    handleSelect: createHandleSelect, 
    handleClose,
    updateQuery,
    activateSuggestion
  } = useMentionSuggestionState();

  // Create the handle select function with editor and handleMentionSelect injected
  const handleSelect = useCallback(
    (item: MentionItem) => createHandleSelect(editor, handleMentionSelect)(item),
    [editor, createHandleSelect, handleMentionSelect]
  );

  // Use hook for handling keyboard events
  useMentionKeyboardEvents(
    editor,
    mentionSuggestion,
    activateSuggestion,
    updateQuery,
    handleClose
  );
  
  // Debug logging to track mention system status
  useEffect(() => {
    if (mentionSuggestion.active) {
      console.log('Mention suggestion activated with query:', mentionSuggestion.query);
    }
  }, [mentionSuggestion.active, mentionSuggestion.query]);
  
  return {
    handleMentionSelect,
    mentionSuggestion,
    handleSelect,
    handleClose,
    searchAllEntities,
    isSearching
  };
}
