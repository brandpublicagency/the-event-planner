
import { Editor } from '@tiptap/react';
import { useEffect } from 'react';
import { PluginKey } from '@tiptap/pm/state';
import { SuggestionOptions } from '@tiptap/suggestion';

// Create a plugin key for the suggestion
const suggestionPluginKey = new PluginKey('mention-suggestion');

export function useEditorSetup(editor: Editor | null) {
  useEffect(() => {
    if (!editor) return;
    
    // Import Suggestion here to avoid issues with SSR
    const importSuggestion = async () => {
      try {
        const { default: Suggestion } = await import('@tiptap/suggestion');
        
        // The actual configuration will be handled by the mention hook
        // This just ensures the extension is registered
        editor.registerPlugin(Suggestion({
          editor,
          pluginKey: suggestionPluginKey,
          char: '/',
          items: () => [],
          render: () => ({
            onStart: () => {},
            onUpdate: () => {},
            onKeyDown: () => false,
            onExit: () => {}
          }),
          command: () => {}
        } as SuggestionOptions));
        
        return () => {
          // Clean up
          if (editor && !editor.isDestroyed) {
            editor.unregisterPlugin(suggestionPluginKey);
          }
        };
      } catch (error) {
        console.error("Error loading suggestion extension:", error);
      }
    };
    
    const cleanup = importSuggestion();
    
    return () => {
      // Handle cleanup when the component unmounts
      if (cleanup) {
        Promise.resolve(cleanup).then(cleanupFn => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [editor]);

  // Force editor focus when it becomes available
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setTimeout(() => {
        editor.commands.focus('end');
      }, 100);
    }
  }, [editor]);
}
