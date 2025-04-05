
import { Editor } from '@tiptap/react';
import { useCallback, useState, useEffect } from 'react';
import { useMentionCommands } from './useMentionCommands';
import { MentionItem } from '@/components/documents/MentionSelector';

interface SlashCommandState {
  active: boolean;
  position: { top: number; left: number } | null;
  query: string;
  mentionType: string | null;
}

/**
 * Main hook that combines all mention functionality
 */
export function useMentionHandler(editor: Editor | null) {
  // Use commands hook for editor interactions
  const { handleMentionSelect } = useMentionCommands(editor);
  
  // State for slash command suggestions
  const [slashCommand, setSlashCommand] = useState<SlashCommandState>({
    active: false,
    position: null,
    query: '',
    mentionType: null
  });

  // Handle mention selection and close the suggestion popup
  const handleSelect = useCallback((item: MentionItem) => {
    if (editor) {
      handleMentionSelect(item);
      setSlashCommand({
        active: false,
        position: null,
        query: '',
        mentionType: null
      });
    }
  }, [editor, handleMentionSelect]);

  // Close the suggestion popup
  const handleClose = useCallback(() => {
    setSlashCommand({
      active: false,
      position: null,
      query: '',
      mentionType: null
    });
  }, []);

  // Listen for slash command keypress and update state accordingly
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // We need to detect slash inside the editor
      if (event.key === '/' && event.target instanceof HTMLElement && 
          event.target.closest('.ProseMirror')) {
        
        // Get the position for the popup
        const { view } = editor;
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        
        // Get coordinates relative to the editor
        const coords = view.coordsAtPos($from.pos);
        const editorDOM = view.dom as HTMLElement;
        const editorRect = editorDOM.getBoundingClientRect();
        
        setSlashCommand({
          active: true,
          position: {
            top: coords.top - editorRect.top + 24, // Adjust below the cursor
            left: coords.left - editorRect.left
          },
          query: '',
          mentionType: null
        });
      }
    };
    
    // Handle editor input to detect mention types (/task, /event, etc.)
    const handleInput = () => {
      if (!slashCommand.active) return;
      
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Get the current line text up to cursor
      const lineStart = $from.start();
      const text = $from.doc.textBetween(lineStart, $from.pos, '\n', '\n');
      
      // Check for mention type patterns
      const taskMatch = text.match(/\/task\s*(.*)$/);
      const eventMatch = text.match(/\/event\s*(.*)$/);
      const documentMatch = text.match(/\/document\s*(.*)$/);
      const docMatch = text.match(/\/doc\s*(.*)$/);
      const userMatch = text.match(/\/user\s*(.*)$/);
      
      // Update state based on detected pattern
      if (taskMatch) {
        setSlashCommand(prev => ({
          ...prev,
          mentionType: 'task',
          query: taskMatch[1] || ''
        }));
      } else if (eventMatch) {
        setSlashCommand(prev => ({
          ...prev,
          mentionType: 'event',
          query: eventMatch[1] || ''
        }));
      } else if (documentMatch || docMatch) {
        setSlashCommand(prev => ({
          ...prev,
          mentionType: 'document',
          query: (documentMatch?.[1] || docMatch?.[1] || '')
        }));
      } else if (userMatch) {
        setSlashCommand(prev => ({
          ...prev,
          mentionType: 'user',
          query: userMatch[1] || ''
        }));
      }
      
      // If we don't have a valid command anymore, close the popup
      const hasValidCommand = text.match(/\/(?:task|event|doc|document|user)\s/);
      if (!hasValidCommand && slashCommand.mentionType) {
        handleClose();
      }
    };
    
    // Create a mutation observer to watch for editor changes
    const editorDOM = editor.view.dom;
    const observer = new MutationObserver(handleInput);
    
    observer.observe(editorDOM, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [editor, slashCommand.active, handleClose]);
  
  return {
    handleMentionSelect,
    slashCommand,
    handleSelect,
    handleClose
  };
}
