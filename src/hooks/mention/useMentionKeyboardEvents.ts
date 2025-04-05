
import { useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { MentionSuggestionState } from './useMentionSuggestionState';

/**
 * Hook for handling keyboard events for mentions
 */
export function useMentionKeyboardEvents(
  editor: Editor | null,
  mentionSuggestion: MentionSuggestionState,
  activateSuggestion: (position: { top: number; left: number }) => void,
  updateQuery: (query: string) => void,
  handleClose: () => void
) {
  // Handle slash keypress to activate suggestions
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // We only want to handle the slash key
      if (event.key === '/' && event.target instanceof HTMLElement && 
          event.target.closest('.ProseMirror')) {
        console.log('Slash key detected in useMentionKeyboardEvents - activating suggestion');
        
        // Get the position for the popup
        const { view } = editor;
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        
        // Calculate cursor position for inline suggestions
        const coords = view.coordsAtPos($from.pos);
        const editorDOM = view.dom as HTMLElement;
        const editorRect = editorDOM.getBoundingClientRect();
        
        // Activate mention suggestion at cursor position
        activateSuggestion({
          top: coords.top - editorRect.top + 24, // Adjust slightly below the cursor
          left: coords.left - editorRect.left
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, activateSuggestion]);

  // Watch for input to update the query
  useEffect(() => {
    if (!mentionSuggestion.active || !editor) return;
    
    // Function to update query based on current text
    const updateQueryFromText = () => {
      try {
        // Get the text from the start of the line to the cursor
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        const lineStart = $from.start();
        const text = $from.doc.textBetween(lineStart, $from.pos, '\n', '\n');
        
        // Extract the query text after the slash
        const match = text.match(/\/([^\s]*)$/);
        
        if (match) {
          // Update the query
          console.log('Updating mention query to:', match[1] || '');
          updateQuery(match[1] || '');
        } else {
          // If there's no match (user deleted the slash), close the popup
          console.log('No slash found, closing suggestion');
          handleClose();
        }
      } catch (error) {
        console.error('Error updating query from text:', error);
        handleClose();
      }
    };
    
    // Create a mutation observer to watch for editor changes
    const editorDOM = editor.view.dom;
    const observer = new MutationObserver(updateQueryFromText);
    
    observer.observe(editorDOM, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Initial update
    updateQueryFromText();
    
    return () => {
      observer.disconnect();
    };
  }, [editor, mentionSuggestion.active, updateQuery, handleClose]);
}
