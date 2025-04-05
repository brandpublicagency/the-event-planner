
import { Editor } from '@tiptap/react';
import { useCallback, useState, useEffect } from 'react';
import { useMentionCommands } from './useMentionCommands';
import { MentionItem } from '@/components/documents/MentionSelector';
import { supabase } from '@/integrations/supabase/client';

interface MentionSuggestionState {
  active: boolean;
  position: { top: number; left: number } | null;
  query: string;
}

/**
 * Main hook that combines all mention functionality for inline autocomplete
 */
export function useMentionHandler(editor: Editor | null) {
  // Use commands hook for editor interactions
  const { handleMentionSelect } = useMentionCommands(editor);
  
  // State for mention suggestions
  const [mentionSuggestion, setMentionSuggestion] = useState<MentionSuggestionState>({
    active: false,
    position: null,
    query: ''
  });

  // Search all entity types at once when query changes
  const searchAllEntities = useCallback(async (query: string) => {
    try {
      const results = await Promise.all([
        // Search tasks
        supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(5),
        
        // Search events
        supabase
          .from('events')
          .select('event_code, name')
          .ilike('name', `%${query}%`)
          .limit(5),
        
        // Search documents
        supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(5),
        
        // Search users
        supabase
          .from('profiles')
          .select('id, full_name')
          .ilike('full_name', `%${query}%`)
          .limit(5)
      ]);
      
      // Format results
      const [taskResult, eventResult, documentResult, userResult] = results;
      
      // Combine all results into a single array
      return [
        ...(taskResult.data?.map(task => ({
          id: task.id,
          label: task.title,
          type: 'task' as const
        })) || []),
        
        ...(eventResult.data?.map(event => ({
          id: event.event_code,
          label: event.name,
          type: 'event' as const
        })) || []),
        
        ...(documentResult.data?.map(doc => ({
          id: doc.id,
          label: doc.title,
          type: 'document' as const
        })) || []),
        
        ...(userResult.data?.map(user => ({
          id: user.id,
          label: user.full_name,
          type: 'user' as const
        })) || [])
      ];
    } catch (error) {
      console.error('Error searching entities:', error);
      return [];
    }
  }, []);

  // Handle mention selection and close the suggestion popup
  const handleSelect = useCallback((item: MentionItem) => {
    if (editor) {
      handleMentionSelect(item);
      setMentionSuggestion({
        active: false,
        position: null,
        query: ''
      });
    }
  }, [editor, handleMentionSelect]);

  // Close the suggestion popup
  const handleClose = useCallback(() => {
    setMentionSuggestion({
      active: false,
      position: null,
      query: ''
    });
  }, []);

  // Listen for slash keypress and update state accordingly
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // We only want to handle the slash key
      if (event.key === '/' && event.target instanceof HTMLElement && 
          event.target.closest('.ProseMirror')) {
        
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
        setMentionSuggestion({
          active: true,
          position: {
            top: coords.top - editorRect.top + 24, // Adjust slightly below the cursor
            left: coords.left - editorRect.left
          },
          query: ''
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Watch for input to update the query
    const updateQueryOnInput = () => {
      if (!mentionSuggestion.active || !editor) return;
      
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
        setMentionSuggestion(prev => ({
          ...prev,
          query: match[1] || ''
        }));
      } else {
        // If there's no match (user deleted the slash), close the popup
        handleClose();
      }
    };
    
    // Create a mutation observer to watch for editor changes
    const editorDOM = editor.view.dom;
    const observer = new MutationObserver(updateQueryOnInput);
    
    observer.observe(editorDOM, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [editor, mentionSuggestion.active, handleClose]);
  
  return {
    handleMentionSelect,
    mentionSuggestion,
    handleSelect,
    handleClose,
    searchAllEntities
  };
}
