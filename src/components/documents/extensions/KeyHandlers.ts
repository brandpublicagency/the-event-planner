
import { Extension } from '@tiptap/core';

// Create a Tab key handler extension to improve tab navigation for mentions
export const TabKeyHandler = Extension.create({
  name: 'tabKeyHandler',
  
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Instead of capturing the Tab key globally, we'll handle it in our InlineMentionSuggestions component
        // Let the default Tab behavior happen normally when not in an active mention suggestion
        return false;
      }
    };
  }
});

// Create a slash key handler extension to help ensure the mention system works
export const SlashKeyHandler = Extension.create({
  name: 'slashKeyHandler',
  
  addKeyboardShortcuts() {
    return {
      '/': ({ editor }) => {
        console.log('Slash key shortcut triggered');
        // Don't handle the key, let it be typed, just log it
        return false;
      }
    };
  }
});
